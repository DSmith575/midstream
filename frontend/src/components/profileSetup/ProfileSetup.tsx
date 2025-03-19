import { Button } from "@/components/ui/button";

interface ProfileSetupProps {
	onClick: () => void;
}

const ProfileSetup = ({ onClick }: ProfileSetupProps) => {
	return (
		<section className="mx-8 mt-2 flex h-[50vh] flex-col items-center justify-center text-center">
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
