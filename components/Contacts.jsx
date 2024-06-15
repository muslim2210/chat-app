"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import { CheckCircle, RadioButtonUnchecked } from "@mui/icons-material";
import { Input } from "./ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import Image from "next/image";

const Contacts = () => {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [createdChat, setCreatedChat] = useState(false);

  const { data: session } = useSession();
  const currentUser = session?.user;

  // get contacts data
  const getContacts = async () => {
    try {
      const res = await fetch(
        search !== "" ? `/api/users/searchContact/${search}` : "/api/users"
      );
      const data = await res.json();
      setContacts(data.filter((contact) => contact._id !== currentUser._id));
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (currentUser) getContacts();
  }, [currentUser, search]);

  /* SELECT CONTACT */
  const [selectedContacts, setSelectedContacts] = useState([]);
  const isGroup = selectedContacts.length > 1;

  const handleSelect = (contact) => {
    if (selectedContacts.includes(contact)) {
      setSelectedContacts((prevSelectedContacts) =>
        prevSelectedContacts.filter((item) => item !== contact)
      );
    } else {
      setSelectedContacts((prevSelectedContacts) => [
        ...prevSelectedContacts,
        contact,
      ]);
    }
  };

  /* ADD GROUP CHAT NAME */
  const [name, setName] = useState("");

  const router = useRouter();

  /* CREATE CHAT */
  const createChat = async () => {
    setCreatedChat(true);
    const res = await fetch("/api/chats", {
      method: "POST",
      body: JSON.stringify({
        currentUserId: currentUser._id,
        members: selectedContacts.map((contact) => contact._id),
        isGroup,
        name,
      }),
    });
    const chat = await res.json();

    if (res.ok) {
      setCreatedChat(false);
      router.push(`/chat/${chat._id}`);
      toast.success("Your chat has been created");
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="h-[80vh] flex flex-col pb-20 gap-5 mt-10">
      <Input
        placeholder="Search contact..."
        className="input-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex gap-7 items-start max-lg:flex-col">
        <div className="h-[550px] w-1/2 max-lg:w-full bg-muted flex flex-col gap-5 rounded-3xl py-5 px-8">
          <p className="text-body-bold">Select or Deselect</p>
          <ScrollArea className="flex flex-col flex-1 gap-y-5 py-5">
            {contacts.map((user, index) => (
              <div
                key={index}
                className="contact p-3"
                onClick={() => handleSelect(user)}
              >
                {selectedContacts.find((item) => item === user) ? (
                  <CheckCircle sx={{ color: "red" }} />
                ) : (
                  <RadioButtonUnchecked />
                )}

                <Image
                  src={user.profileImage || "/assets/person.jpg"}
                  alt="profile"
                  width={200}
                  height={200}
                  className="profilePhoto"
                />
                <p className="text-base-bold">{user.username}</p>
              </div>
            ))}
          </ScrollArea>
        </div>

        <div className="create-chat">
          {isGroup && (
            <>
              <div className="flex flex-col gap-3">
                <p className="text-body-bold">Group Chat Name</p>
                <Input
                  placeholder="Enter group chat name..."
                  className="input-group-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-body-bold">Members</p>
                <div className="flex flex-wrap gap-3">
                  {selectedContacts.map((contact, index) => (
                    <p className="selected-contact" key={index}>
                      {contact.username}
                    </p>
                  ))}
                </div>
              </div>
            </>
          )}
          <Button
            className="bg-primary-1"
            disabled={selectedContacts.length === 0}
            onClick={createChat}
          >
            {createdChat ? "Loading..." : "FIND OR CREATE CHAT"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
