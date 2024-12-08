import { useState, useEffect, useRef } from 'react';
import { cn } from '@/utils';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from '@/components/ui/label';

const ChatPage = () => {
	const [messages, setMessages] = useState<string[]>([]);
	const [inputValue, setInputValue] = useState<string>('');

	const handleSend = () => {
		if (inputValue.trim()) {
			setMessages((prevMessages) => [...prevMessages, inputValue]);
			setInputValue('');
		}
	};

	const conversationEndRef = useRef<HTMLDivElement>(null);

	// Scroll to the bottom whenever messages change
	useEffect(() => {
		if (conversationEndRef.current) {
			conversationEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages]); // Trigger on messages change

	return (
		<div className={`flex flex-col xs:justify-center ${messages.length > 0 && 'h-[90vh]'} mx-8 mt-4`}>
			{/* Conversation Area */}
			<div
				className={`flex flex-col overflow-y-auto p-4 ${
					messages.length > 0 ? 'bg-gray-100' : 'bg-none'
				} rounded-md flex-grow`}>
				{messages.map((msg, idx) => (
					<div
						key={idx}
						className={cn(
							'p-3 rounded-md mb-3 max-w-lg break-words',
							idx % 2 === 0 ? 'bg-gray-200 self-start' : 'bg-blue-200 self-end',
						)}>
						<p>{msg}</p>
					</div>
				))}
				{/* Ref element to scroll to the bottom */}
				<div ref={conversationEndRef} />
			</div>

			{/* Input Area */}
			<div className={`p-4 bg-white flex items-center max-w-md md:max-w-full sm:flex-shrink-0`}>
				<div className="grid w-full gap-1.5">
					<Label htmlFor={"chat-input"}>Under Construction</Label>
					<Textarea
					maxLength={500}
						id={"chat-input"}
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						placeholder="Type a message..."
					/>
					<Button  onClick={handleSend}>Send</Button>
				</div>
			</div>
		</div>
	);
};
export default ChatPage;
