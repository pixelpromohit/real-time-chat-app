import { HOST } from "@/utils/constants";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

const ContactList = ({ contacts = [], isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatType,
    setSelectedChatData,
    setSelectedChatMessages,
  } = useAppStore();

  const handleClick = (contact) => {
    if (isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contact");
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  return (
    <div className="mt-5">
      {contacts.map((contact) => {
        const isSelected =
          selectedChatData && selectedChatData._id === contact._id;

        const firstName = contact.firstName || "";
        const lastName = contact.lastName || "";
        const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();

        return (
          <div
            key={contact._id}
            className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
              isSelected ? "bg-[#8417ff] hover:bg-[#8417ff]" : "hover:bg-[#f1f1f111]"
            }`}
            onClick={() => handleClick(contact)}
          >
            <div className="flex gap-5 items-center justify-start text-neutral-300">
              {!isChannel ? (
                <Avatar className="h-10 w-10">
                  {contact.image ? (
                    <AvatarImage
                      src={`${HOST}/${contact.image}`}
                      alt="profile"
                      className="rounded-full bg-cover h-full w-full"
                    />
                  ) : null}
                  <AvatarFallback
                    className={`uppercase ${
                      isSelected
                        ? "bg-[#ffffff22] border border-white/50"
                        : getColor(contact.color)
                    } h-10 w-10 flex items-center justify-center rounded-full`}
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                  #
                </div>
              )}

              <span>
                {isChannel
                  ? contact.name || "Unnamed Channel"
                  : `${firstName} ${lastName}`.trim() || "Unnamed Contact"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContactList;
