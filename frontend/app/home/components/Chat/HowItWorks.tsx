import Image from "next/image";

export const HowItWorks = () => {
  return (
    <div className="p-0 lg:px-12">
      <div className="sticky top-8">
        <div className="space-y-1">
          <div className="bg-[#F2F2F2] p-6">
            <div className="space-y-1">
              <div className="flex flex-col space-y-1">
                <a
                  href="/faq"
                  className="text-blue-600 hover:text-blue-800 text-[16px] font-[500] font-inter"
                >
                  FAQ
                </a>
                <a
                  href="/lore"
                  className="text-blue-600 hover:text-blue-800 text-[16px] font-[500] font-inter"
                >
                  Lore
                </a>
                <a
                  href="/terms"
                  className="text-blue-600 hover:text-blue-800 text-[16px] font-[500] font-inter"
                >
                  Terms
                </a>
                <div className="flex items-center gap-2 pt-2">
                  {[
                    {
                      link: process.env.NEXT_PUBLIC_X_LINK,
                      icon: "/x.svg",
                      alt: "X",
                    },
                    {
                      link: process.env.NEXT_PUBLIC_GITHUB_LINK,
                      icon: "/github.svg",
                      alt: "Github",
                    },
                  ].map((item) => (
                    <a href={item.link} key={item.link} target="_blank">
                      <Image
                        src={item.icon}
                        alt={item.alt}
                        width={16}
                        height={16}
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
