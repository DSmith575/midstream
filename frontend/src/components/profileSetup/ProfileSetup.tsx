import { Button } from "../ui/button";

interface ProfileSetupProps {
	firstName: string;
	lastName: string;
	onClick: () => void;
}

const ProfileSetup = ({ firstName, lastName, onClick }: ProfileSetupProps) => {
	return (
		<section className="mx-8 mt-2 flex h-[50vh] flex-col items-center justify-center text-center">
			<h1 className="text-xl">
				Hello {firstName} {lastName}!
			</h1>
			<p>Get your profile setup to get started.</p>
			<section className="mr-2 flex gap-2">
				<Button variant="outline" size="lg" className="" onClick={onClick}>
					Profile Setup
				</Button>
			</section>
		</section>
	);
};

export default ProfileSetup;
