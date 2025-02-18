import { IconiFy } from "../common/Iconify";
import { Button } from "../ui/button";

type Props = {
	onDownload?: VoidFunction;
};

export default function DownloadButton({ onDownload }: Props) {
	return (
		<Button
			onClick={onDownload}
			className="m-0 mr-1 h-auto rounded-full p-0 opacity-75"
			variant={"green"}
		>
			<IconiFy icon="eva:arrow-circle-down-fill" width={24} />
		</Button>
	);
}
