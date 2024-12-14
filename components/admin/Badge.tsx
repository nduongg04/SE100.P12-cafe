import Image from "next/image";

type BadgeProps = {
    iconHref: string;
    value: string;
    title: string;
};

const Badge = ({ iconHref, value, title }: BadgeProps) => {
    // Format the value if it's a currency
    const formattedValue = title.toLowerCase().includes('revenue')
        ? `$${parseInt(value.replace(/[^0-9.-]+/g, "")).toLocaleString('en-US')}`
        : value;

    return (
        <div className="flex flex-1 items-center justify-center gap-4 rounded-md bg-white px-9 py-5 text-black-purple shadow-black-medium">
            <div className="flex aspect-square items-center justify-center rounded-full bg-dark-green/15 p-2">
                <Image
                    src={iconHref}
                    alt={title}
                    width={50}
                    height={50}
                    className="w-[50px]"
                />
            </div>
            <div className="flex flex-col">
                <span className="text-4xl font-bold">{formattedValue}</span>
                <span className="text-sm">{title}</span>
            </div>
        </div>
    );
};
export default Badge;

