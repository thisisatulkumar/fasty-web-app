import { AlertTriangle } from 'lucide-react';
import { Alert, AlertTitle } from '@/components/ui/alert';

export const NoRefundNotice = () => {
	return (
		<Alert variant="destructive">
			<AlertTriangle className="h-4 w-4" />
			<AlertTitle>No Cancellations or Refunds</AlertTitle>
		</Alert>
	);
};
