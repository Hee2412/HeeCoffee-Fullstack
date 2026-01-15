// src/components/OrderWorkflow.jsx
import { useState } from 'react';
import { 
  CheckCircle, Package, Truck, XCircle, Clock, 
  AlertCircle, ChevronRight 
} from 'lucide-react';
import s from '../styles/OrderWorkflow.module.scss';

export default function OrderWorkflow({ order, onStatusUpdate }) {
  const [loading, setLoading] = useState(false);

  // Define workflow steps
  const workflowSteps = {
    'PENDING_PAYMENT': {
      icon: Clock,
      color: 'warning',
      label: 'Pending Payment',
      nextActions: [
        { status: 'ACTIVE', label: 'Confirm Order', icon: CheckCircle },
        { status: 'CANCELED', label: 'Cancel', icon: XCircle, danger: true }
      ]
    },
    'ACTIVE': {
      icon: Package,
      color: 'info',
      label: 'Processing',
      nextActions: [
        { status: 'SHIPPING', label: 'Ship Order', icon: Truck },
        { status: 'CANCELED', label: 'Cancel', icon: XCircle, danger: true }
      ]
    },
    'SHIPPING': {
      icon: Truck,
      color: 'primary',
      label: 'Shipping',
      nextActions: [
        { status: 'COMPLETED', label: 'Complete', icon: CheckCircle }
      ]
    },
    'COMPLETED': {
      icon: CheckCircle,
      color: 'success',
      label: 'Completed',
      nextActions: []
    },
    'CANCELED': {
      icon: XCircle,
      color: 'danger',
      label: 'Canceled',
      nextActions: []
    },
    'ABANDONED': {
      icon: AlertCircle,
      color: 'secondary',
      label: 'Abandoned',
      nextActions: []
    }
  };

  const currentStep = workflowSteps[order.status] || workflowSteps['PENDING_PAYMENT'];
  const StatusIcon = currentStep.icon;

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    try {
      await onStatusUpdate(order.orderId, newStatus);
    } finally {
      setLoading(false);
    }
  };

  // If order is final status (completed/canceled), show read-only badge
  if (currentStep.nextActions.length === 0) {
    return (
      <div className={`${s.status_badge} ${s[currentStep.color]} ${s.final}`}>
        <StatusIcon size={16} />
        <span>{currentStep.label}</span>
      </div>
    );
  }

  return (
    <div className={s.workflow_container}>
      {/* Current Status */}
      <div className={`${s.current_status} ${s[currentStep.color]}`}>
        <StatusIcon size={18} />
        <span>{currentStep.label}</span>
      </div>

      {/* Action Buttons */}
      <div className={s.action_buttons}>
        {currentStep.nextActions.map((action) => {
          const ActionIcon = action.icon;
          return (
            <button
              key={action.status}
              className={`${s.action_btn} ${action.danger ? s.danger : s.primary}`}
              onClick={() => handleStatusChange(action.status)}
              disabled={loading}
            >
              <ActionIcon size={16} />
              <span>{action.label}</span>
              <ChevronRight size={14} className={s.arrow} />
            </button>
          );
        })}
      </div>
    </div>
  );
}