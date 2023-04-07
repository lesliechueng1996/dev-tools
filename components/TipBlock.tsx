import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/solid';

type Props = {
  type: 'success' | 'warn' | 'error';
  msg: string;
};

function TipBlock({ type, msg }: Props) {
  const colors = {
    success: {
      bgColor: 'bg-emerald-200',
      iconColor: 'text-emerald-700',
    },
    warn: {
      bgColor: 'bg-amber-200/50',
      iconColor: 'text-yellow-700',
    },
    error: {
      bgColor: 'bg-rose-300',
      iconColor: 'text-rose-700',
    },
  };

  return (
    <div
      className={`${colors[type].bgColor} px-3 py-5 theme-border flex items-center gap-3`}
    >
      {type === 'success' ? (
        <>
          <CheckCircleIcon className={`w-6 h-6 ${colors[type].iconColor}`} />
          <span>{msg}</span>
        </>
      ) : type === 'warn' ? (
        <>
          <ExclamationCircleIcon
            className={`w-6 h-6 ${colors[type].iconColor}`}
          />
          <span>{msg}</span>
        </>
      ) : (
        <>
          <XCircleIcon className={`w-6 h-6 ${colors[type].iconColor}`} />
          <span>{msg}</span>
        </>
      )}
    </div>
  );
}

export default TipBlock;
