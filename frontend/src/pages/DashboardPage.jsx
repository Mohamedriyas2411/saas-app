import { useAuth } from '../context/AuthContext'
import { useQuery } from 'react-query'
import { subscriptionAPI } from '../services/api'
import { Calendar, CreditCard, TrendingUp, Users } from 'lucide-react'
import { format } from 'date-fns'

const DashboardPage = () => {
  const { user } = useAuth()
  
  const { data: subscription, isLoading } = useQuery(
    'subscription',
    subscriptionAPI.getCurrentSubscription,
    {
      select: (response) => response.data.subscription
    }
  )

  const stats = [
    {
      name: 'Account Status',
      value: user?.isActive ? 'Active' : 'Inactive',
      icon: Users,
      color: user?.isActive ? 'green' : 'red'
    },
    {
      name: 'Subscription',
      value: subscription?.planName || 'No Plan',
      icon: CreditCard,
      color: subscription ? 'blue' : 'gray'
    },
    {
      name: 'Status',
      value: subscription?.status || 'None',
      icon: TrendingUp,
      color: subscription?.status === 'active' ? 'green' : 'yellow'
    },
    {
      name: 'Member Since',
      value: user?.createdAt ? format(new Date(user.createdAt), 'MMM yyyy') : 'N/A',
      icon: Calendar,
      color: 'purple'
    }
  ]

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600">
          Here's an overview of your account and subscription.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const colorClasses = {
            green: 'text-green-600 bg-green-100',
            blue: 'text-blue-600 bg-blue-100',
            red: 'text-red-600 bg-red-100',
            yellow: 'text-yellow-600 bg-yellow-100',
            purple: 'text-purple-600 bg-purple-100',
            gray: 'text-gray-600 bg-gray-100'
          }
          
          return (
            <div key={stat.name} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${colorClasses[stat.color]}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Subscription Details */}
      {subscription ? (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Subscription Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-700">Current Plan</h3>
              <p className="text-lg text-gray-900">{subscription.planName}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Status</h3>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                subscription.status === 'active' 
                  ? 'bg-green-100 text-green-800'
                  : subscription.status === 'trialing'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Current Period</h3>
              <p className="text-gray-900">
                {format(new Date(subscription.currentPeriodStart), 'MMM dd, yyyy')} - {' '}
                {format(new Date(subscription.currentPeriodEnd), 'MMM dd, yyyy')}
              </p>
            </div>
            {subscription.status === 'trialing' && subscription.trialEnd && (
              <div>
                <h3 className="font-medium text-gray-700">Trial Ends</h3>
                <p className="text-gray-900">
                  {format(new Date(subscription.trialEnd), 'MMM dd, yyyy')}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CreditCard className="h-8 w-8 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                No Active Subscription
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>You don't have an active subscription. Choose a plan to get started.</p>
              </div>
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex">
                  <a
                    href="/subscription"
                    className="bg-yellow-100 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-200"
                  >
                    View Plans
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/profile"
            className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900">Update Profile</h3>
            <p className="text-sm text-gray-500">Change your account settings</p>
          </a>
          <a
            href="/subscription"
            className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900">Manage Subscription</h3>
            <p className="text-sm text-gray-500">Upgrade, downgrade, or cancel</p>
          </a>
          <a
            href="#"
            className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900">Get Support</h3>
            <p className="text-sm text-gray-500">Contact our support team</p>
          </a>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
