import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import useGetAllReferrals from "@/hooks/adminReferrals/useGetAllReferrals";
import Spinner from "../spinner/Spinner";

const DataTable = () => {
	const { isLoading, isError, error, referrals } = useGetAllReferrals();
	return (
		<>
			{isLoading && <Spinner />}

      {isError && (
        <div className="mt-12 flex flex-col items-center justify-center">
          <p className="text-red-500">Error fetching data!</p>
          {error && (
            <p className="text-sm text-muted-foreground">{error.message}</p>
          )}
        </div>
      )}

			{referrals && (
				<Table>
					{/* <TableCaption>Data will update every 2 minutes</TableCaption> */}
					<TableHeader>
						<TableRow>
							<TableHead>ID</TableHead>
							<TableHead>Name</TableHead>
							<TableHead>City</TableHead>
							<TableHead>Suburb</TableHead>
							<TableHead>Created At</TableHead>
							<TableHead>Updated At</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{referrals.map((referral: any) => (
							<TableRow key={referral.id} className={"hover:bg-green-500"} onClick={() => alert("test")}>
								<TableCell>{referral.id}</TableCell>
								<TableCell>{`${referral.user.personalInformation.firstName} ${referral.user.personalInformation.lastName}`}</TableCell>
								<TableCell>{`${referral.user.addressInformation.city}`}</TableCell>
								<TableCell>{`${referral.user.addressInformation.suburb}`}</TableCell>
								<TableCell>
									{new Date(referral.createdAt).toLocaleString()}
								</TableCell>
								<TableCell>
									{new Date(referral.updatedAt).toLocaleString()}
								</TableCell>
								<TableCell>{referral.status}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</>
	);
};

export default DataTable;
