#[test]
fn test_deposit() {
    let caller = contract_address_const::<'caller'>();
    let (dispatcher, vault_address, token_dispatcher) = deploy();

    // Approve the vault to transfer tokens on behalf of the caller
    let amount: felt252 = 10.into();
    token_dispatcher.approve(vault_address.into(), amount);
    set_contract_address(caller);

    // Deposit tokens into the vault
    let amount: u256 = 10.into();
    let _deposit = dispatcher.deposit(amount);
    println!("deposit :{:?}", _deposit);

    // Check balances and total supply
    let balance_of_caller = dispatcher.user_balance_of(caller);
    let total_supply = dispatcher.contract_total_supply();

    assert_eq!(balance_of_caller, amount);
    assert_eq!(total_supply, amount);
}

#[test]
fn test_deposit_withdraw() {
    let caller = contract_address_const::<'caller'>();
    let (dispatcher, vault_address, token_dispatcher) = deploy();

    // Approve the vault to transfer tokens on behalf of the caller
    let amount: felt252 = 10.into();
    token_dispatcher.approve(vault_address.into(), amount);
    set_contract_address(caller);
    set_account_contract_address(vault_address);

    // Deposit tokens into the vault
    let amount: u256 = 10.into();
    dispatcher.deposit(amount);
    dispatcher.withdraw(amount);

    // Check balances of user in the vault after withdraw
    let balance_of_caller = dispatcher.user_balance_of(caller);

    assert_eq!(balance_of_caller, 0.into());
}