import PropTypes from 'prop-types';

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  color = 'blue',
  trend,
  trendValue 
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      value: 'text-blue-600'
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-600',
      value: 'text-green-600'
    },
    yellow: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-600',
      value: 'text-yellow-600'
    },
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-600',
      value: 'text-purple-600'
    },
    red: {
      bg: 'bg-red-100',
      text: 'text-red-600',
      value: 'text-red-600'
    },
    indigo: {
      bg: 'bg-indigo-100',
      text: 'text-indigo-600',
      value: 'text-indigo-600'
    },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100 transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 ${colors.bg} rounded-xl`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend === 'up' ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181"
                />
              </svg>
            )}
            {trendValue}
          </div>
        )}
      </div>
      <h3 className="text-gray-600 font-medium text-sm mb-1">{title}</h3>
      <p className={`text-3xl font-bold ${colors.value}`}>{value}</p>
    </div>
  );
};

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node.isRequired,
  color: PropTypes.oneOf(['blue', 'green', 'yellow', 'purple', 'red', 'indigo']),
  trend: PropTypes.oneOf(['up', 'down']),
  trendValue: PropTypes.string,
};

export default StatsCard;
