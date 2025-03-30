const UserProfileCard  = ({
	title,
	data,
	fields,
}: {
	title: string;
	data: any;
	fields: { key: string; label?: string }[];
}) => {
	if (!data) return null;

	return (
		<section className="mt-4">
			<h3 className="font-semibold">{title}</h3>
			{fields.map(({ key, label }) =>
				data[key] ? (
					<p key={key} className="text-sm text-muted-foreground">
						{label && <span className="text-black">{label}: </span>}
						{key === "dateOfBirth"
							? new Date().getFullYear() - new Date(data[key]).getFullYear()
							: data[key]}
					</p>
				) : null
			)}
		</section>
	);
};

export default UserProfileCard;