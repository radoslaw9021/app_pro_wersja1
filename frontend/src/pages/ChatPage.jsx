import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    console.log('Fetching chat data');
    setLoading(false);

    const sampleContacts = [
      { id: 1, name: 'Anna Kowalska', role: 'Esthetician', status: 'online', unread: 2 },
      { id: 2, name: 'Jan Nowak', role: 'Client', status: 'offline', unread: 0 },
      { id: 3, name: 'Maria Wiśniewska', role: 'Esthetician', status: 'online', unread: 0 }
    ];
    setContacts(sampleContacts);
    setActiveContact(sampleContacts[0]);

    const sampleMessages = [
      { id: 1, sender: 'Anna Kowalska', senderId: 1, text: 'Hello! How is your skincare routine going?', timestamp: '10:30 AM', isOwn: false },
      { id: 2, sender: user?.name, senderId: user?.id, text: 'Hi Anna! It\'s going well. I\'ve been using the new serum you recommended.', timestamp: '10:35 AM', isOwn: true },
      { id: 3, sender: 'Anna Kowalska', senderId: 1, text: 'Great to hear! Have you noticed any improvements with hydration?', timestamp: '10:36 AM', isOwn: false }
    ];
    setMessages(sampleMessages);
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    console.log('Sending message:', newMessage);

    const newMessageObj = {
      id: messages.length + 1,
      sender: user?.name,
      senderId: user?.id,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    };

    setMessages([...messages, newMessageObj]);
    setNewMessage('');
  };

  const selectContact = (contact) => {
    setActiveContact(contact);
    // Tu ewentualnie załadujesz wiadomości tej osoby
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>

        <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col md:flex-row">
          {/* Lista kontaktów */}
          <div className="w-full md:w-1/3 lg:w-1/4 border-r">
            <div className="p-4 border-b">
              <input
                type="text"
                placeholder="Search contacts..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: '500px' }}>
              {contacts.map(contact => (
                <div
                  key={contact.id}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 flex items-center ${activeContact?.id === contact.id ? 'bg-purple-50' : ''}`}
                  onClick={() => selectContact(contact)}
                >
                  <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-semibold mr-3">
                    {contact.name.charAt(0)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{contact.name}</h3>
                      {contact.unread > 0 && (
                        <span className="bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {contact.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{contact.role}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${contact.status === 'online' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                </div>
              ))}
            </div>
          </div>

          {/* Obszar czatu */}
          <div className="flex-grow flex flex-col h-[600px]">
            {activeContact ? (
              <>
                <div className="p-4 border-b flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-semibold mr-3">
                    {activeContact.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-medium">{activeContact.name}</h2>
                    <p className="text-sm text-gray-500">
                      {activeContact.status === 'online' ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>

                <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`mb-4 flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`rounded-lg px-4 py-2 max-w-xs ${message.isOwn ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                        <p className="text-sm">{message.text}</p>
                        <span className="text-xs text-gray-400 block mt-1 text-right">{message.timestamp}</span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t bg-white flex">
                  <input
                    type="text"
                    className="flex-grow border rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-purple-500 text-white px-6 py-2 rounded-r-md hover:bg-purple-600"
                  >
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-grow p-4 flex items-center justify-center text-gray-500">
                Select a contact to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
