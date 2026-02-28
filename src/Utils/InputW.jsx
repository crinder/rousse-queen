export default function InputW({icon: Icon, children}) {

    return (
        <div className="relative w-full">
            <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10" />
            {children}
        </div>
    )
}
