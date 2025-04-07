import { LockKeyhole } from "lucide-react";
interface OverlayTextProps {
    RestrictedText: string;
}
export const OverlayText = ({RestrictedText}: OverlayTextProps) => {
    return(    <div className="absolute inset-0 flex items-center justify-center">
    <div className="text-center text-sm text-gray flex flex-col items-center px-4 py-2 rounded shadow">
      <LockKeyhole size={38} color='black' />
      {RestrictedText}
    </div>
    </div>);
}

