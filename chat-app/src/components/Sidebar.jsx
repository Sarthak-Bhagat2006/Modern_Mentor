import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "../skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import { useParams } from "react-router-dom";

const Sidebar = () => {
  const {
    members,
    getMembers,
    selectedMember,
    setSelectedMember,
    isMembersLoading,
    onlineMembers,
  } = useChatStore();

  const { groupId } = useParams();

  useEffect(() => {
    if (groupId) getMembers(groupId);
  }, [groupId]);

  if (isMembersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Group Members</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {members.map((member) => (
          <button
            key={member._id}
            onClick={() => setSelectedMember(member)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${
                selectedMember?._id === member._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={member.profilePic || "/image.png"}
                alt={member.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineMembers.includes(member._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{member.name}</div>
              <div className="text-sm text-zinc-400">
                {onlineMembers.includes(member._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
