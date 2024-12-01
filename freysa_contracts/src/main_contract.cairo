use starknet::ContractAddress;
use openzeppelin::token::erc20::interface::{
    IERC20Dispatcher, IERC20DispatcherTrait
};
use openzeppelin::token::erc20::ERC20;
use core::array::SpanTrait;
use core::array::ArrayTrait;
use core::array::ToSpanTrait;
 
// In order to make contract calls within our Vault,
// we need to have the interface of the remote ERC20 contract defined to import the Dispatcher.
#[starknet::interface]
pub trait IERC20<TContractState> {
    fn get_name(self: @TContractState) -> felt252;
    fn get_symbol(self: @TContractState) -> felt252;
    fn get_decimals(self: @TContractState) -> u8;
    fn get_total_supply(self: @TContractState) -> felt252;
    fn balance_of(self: @TContractState, account: ContractAddress) -> felt252;
    fn allowance(
        self: @TContractState, owner: ContractAddress, spender: ContractAddress
    ) -> felt252;
    fn transfer(ref self: TContractState, recipient: ContractAddress, amount: felt252);
    fn transfer_from(
        ref self: TContractState,
        sender: ContractAddress,
        recipient: ContractAddress,
        amount: felt252
    );
    fn approve(ref self: TContractState, spender: ContractAddress, amount: felt252);
    fn increase_allowance(ref self: TContractState, spender: ContractAddress, added_value: felt252);
    fn decrease_allowance(
        ref self: TContractState, spender: ContractAddress, subtracted_value: felt252
    );
}
 
#[starknet::interface]
pub trait ISimpleVault<TContractState> {
    fn deposit(ref self: TContractState, amount: u256);
    fn withdraw(ref self: TContractState, shares: u256);
    fn user_balance_of(ref self: TContractState, account: ContractAddress) -> u256;
    fn contract_total_supply(ref self: TContractState) -> u256;
}
 
#[starknet::contract]
pub mod SimpleVault {
    use super::{IERC20Dispatcher, IERC20DispatcherTrait};
    use starknet::{ContractAddress, get_caller_address, get_contract_address};
    use starknet::storage::{
        Map, StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess,
        StoragePointerWriteAccess
    };
 
    #[storage]
    struct Storage {
        token: IERC20Dispatcher,
        total_supply: u256,
        balance_of: Map<ContractAddress, u256>
    }
 
    #[constructor]
    fn constructor(ref self: ContractState, token: ContractAddress) {
        self.token.write(IERC20Dispatcher { contract_address: token });
    }
 
    #[generate_trait]
    impl PrivateFunctions of PrivateFunctionsTrait {
        fn _mint(ref self: ContractState, to: ContractAddress, shares: u256) {
            self.total_supply.write(self.total_supply.read() + shares);
            self.balance_of.write(to, self.balance_of.read(to) + shares);
        }
 
        fn _burn(ref self: ContractState, from: ContractAddress, shares: u256) {
            self.total_supply.write(self.total_supply.read() - shares);
            self.balance_of.write(from, self.balance_of.read(from) - shares);
        }
    }
 
    #[abi(embed_v0)]
    impl SimpleVault of super::ISimpleVault<ContractState> {
        fn user_balance_of(ref self: ContractState, account: ContractAddress) -> u256 {
            self.balance_of.read(account)
        }
 
        fn contract_total_supply(ref self: ContractState) -> u256 {
            self.total_supply.read()
        }
 
        fn deposit(ref self: ContractState, amount: u256) {
            // a = amount
            // B = balance of token before deposit
            // T = total supply
            // s = shares to mint
            //
            // (T + s) / T = (a + B) / B
            //
            // s = aT / B
            let caller = get_caller_address();
            let this = get_contract_address();
 
            let mut shares = 0;
            if self.total_supply.read() == 0 {
                shares = amount;
            } else {
                let balance: u256 = self.token.read().balance_of(this).try_into().unwrap();
                shares = (amount * self.total_supply.read()) / balance;
            }
 
            PrivateFunctions::_mint(ref self, caller, shares);
 
            let amount_felt252: felt252 = amount.low.into();
            self.token.read().transfer_from(caller, this, amount_felt252);
        }
 
        fn withdraw(ref self: ContractState, shares: u256) {
            // a = amount
            // B = balance of token before withdraw
            // T = total supply
            // s = shares to burn
            //
            // (T - s) / T = (B - a) / B
            //
            // a = sB / T
            let caller = get_caller_address();
            let this = get_contract_address();
 
            let balance = self.user_balance_of(this);
            let amount = (shares * balance) / self.total_supply.read();
            PrivateFunctions::_burn(ref self, caller, shares);
            let amount_felt252: felt252 = amount.low.into();
            self.token.read().transfer(caller, amount_felt252);
        }
    }
}
 
#[cfg(test)]
mod tests {
    use super::{SimpleVault, ISimpleVaultDispatcher, ISimpleVaultDispatcherTrait};
    use openzeppelin::token::erc20::interface::{
        IERC20Dispatcher as IERC20Dispatcher_token,
        IERC20DispatcherTrait as IERC20DispatcherTrait_token
    };
    use starknet::testing::{set_contract_address, set_account_contract_address};
    use starknet::{
        ContractAddress, SyscallResultTrait, syscalls::deploy_syscall, contract_address_const
    };
    use openzeppelin::token::erc20 as ERC20;
    use array::SpanTrait;

 
    const token_name: felt252 = 'myToken';
    const decimals: u8 = 18;
    const initial_supply: felt252 = 100000;
    const symbols: felt252 = 'mtk';
 
    fn deploy() -> (ISimpleVaultDispatcher, ContractAddress, IERC20Dispatcher_token) {
        let _token_address: ContractAddress = contract_address_const::<'token_address'>();
        let caller = contract_address_const::<'caller'>();
 
        let (token_contract_address, _) = deploy_syscall(
            ERC20::TEST_CLASS_HASH.try_into().unwrap(),
            caller.into(),
            array![caller.into(), 'myToken', '8', '1000'.into(), 'MYT'].to_span(),
            false
        )
            .unwrap_syscall();
 
        let (contract_address, _) = deploy_syscall(
            SimpleVault::TEST_CLASS_HASH.try_into().unwrap(),
            0,
            array![token_contract_address.into()].to_span(),
            false
        )
            .unwrap_syscall();
 
        (
            ISimpleVaultDispatcher { contract_address },
            contract_address,
            IERC20Dispatcher_token { contract_address: token_contract_address }
        )
    }
 
}

impl ToSpanTrait for core::array::Array {
    fn to_span(&self) -> Span {
        // Your implementation here
    }
}