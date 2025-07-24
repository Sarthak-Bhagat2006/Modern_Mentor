import { X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedMember, setSelectedMember } = useChatStore();
  const { onlineMembers } = useChatStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedMember.profilePic || "/image.png"}
                alt={selectedMember.name}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedMember.name}</h3>
            <p className="text-sm text-base-content/70">
              {onlineMembers.includes(selectedMember._id)
                ? "Online"
                : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedMember(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
