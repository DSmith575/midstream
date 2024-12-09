import { useState, useEffect, useRef } from 'react';
import { cn } from '@/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Spinner from '../spinner/Spinner';

const Chat = () => {
	const [messages, setMessages] = useState<string[]>([]);
	const [inputValue, setInputValue] = useState<string>('');
	const [disabled, setDisabled] = useState<boolean>(false);

	const handleSend = async () => {
		try {
			setDisabled(true);
			if (inputValue.trim()) {
				setMessages((prevMessages) => [...prevMessages, inputValue]);
				setInputValue('');
			}
			await new Promise((resolve) => setTimeout(resolve, 5000));
		} catch (error) {
			console.error(error);
		} finally {
			setDisabled(false);
		}
	};

	const conversationEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (conversationEndRef.current) {
			conversationEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages]);

	return (
		<div className={`flex flex-col xs:justify-center h-[80vh] mx-8`}>
			{/* Conversation Area */}
			<div
				className={`flex flex-col overflow-y-auto p-4 ${
					messages.length > 0 ? 'bg-gray-100' : 'bg-none'
				} rounded-md flex-grow`}>
				{messages.map((msg, idx) => (
					<div
						key={idx}
						className={cn(
							'p-3 rounded-md mb-3 max-w-full sm:max-w-md lg:max-w-lg break-words',
							idx % 2 === 0 ? 'bg-gray-200 self-start' : 'bg-blue-200 self-end',
						)}>
						<p>{msg}</p>
					</div>
				))}
				{/* Ref element to scroll to the bottom */}
				<div ref={conversationEndRef} />
			</div>

			{/* Input Area */}
			<div
				className={`p-4 bg-white flex items-center max-w-md md:max-w-full sm:flex-shrink-0`}>
				<div className={`flex flex-col w-full gap-1.5`}>
					<Label htmlFor={'chat-input'}>Under Construction</Label>
					<Textarea
						maxLength={500}
						id={'chat-input'}
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						placeholder="Type a message..."
					/>
					<Button
						disabled={disabled}
						className={`bg-blue-500 ${disabled && 'disabled cursor-not-allowed '}`}
						onClick={handleSend}>
						{disabled ? <Spinner className={'w-8 h-8'} /> : 'Send'}
					</Button>
					<p className="text-sm text-muted-foreground">
						AI conversations are not recorded.
					</p>
				</div>
			</div>
		</div>
	);
};
export default Chat;
