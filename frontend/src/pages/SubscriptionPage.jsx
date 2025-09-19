import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { subscriptionAPI } from '../services/api'
import toast from 'react-hot-toast'
import { Check, X, CreditCard, Calendar, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'

const SubscriptionPage = () => {
  const queryClient = useQueryClient()
  const [selectedPlan, setSelectedPlan] = useState(null)

  const { data: plans, isLoading: plansLoading } = useQuery(
    'subscription-plans',
    subscriptionAPI.getPlans,
    {
      select: (response) => response.data.plans
    }
  )

  const { data: currentSubscription, isLoading: subscriptionLoading } = useQuery(
    'current-subscription',
    subscriptionAPI.getCurrentSubscription,
    {
      select: (response) => response.data.subscription
    }
  )

  const createSubscriptionMutation = useMutation(subscriptionAPI.createSubscription, {
    onSuccess: () => {
      queryClient.invalidateQueries('current-subscription')
      toast.success('Subscription created successfully!')
      setSelectedPlan(null)
    },
    onError: (error) => {
      const message = error.response?.data?.error || 'Failed to create subscription'
      toast.error(message)
    }
  })

  const upgradeSubscriptionMutation = useMutation(subscriptionAPI.upgradeSubscription, {
    onSuccess: () => {
      queryClient.invalidateQueries('current-subscription')
      toast.success('Subscription upgraded successfully!')
      setSelectedPlan(null)
    },
    onError: (error) => {
      const message = error.response?.data?.error || 'Failed to upgrade subscription'
      toast.error(message)
    }
  })

  const cancelSubscriptionMutation = useMutation(subscriptionAPI.cancelSubscription, {
    onSuccess: () => {
      queryClient.invalidateQueries('current-subscription')
      toast.success('Subscription will be canceled at the end of the current period')
    },
    onError: (error) => {
      const message = error.response?.data?.error || 'Failed to cancel subscription'
      toast.error(message)
    }
  })

  const reactivateSubscriptionMutation = useMutation(subscriptionAPI.reactivateSubscription, {
    onSuccess: () => {
      queryClient.invalidateQueries('current-subscription')
      toast.success('Subscription reactivated successfully!')
    },
    onError: (error) => {
      const message = error.response?.data?.error || 'Failed to reactivate subscription'
      toast.error(message)
    }
  })

  const handleSelectPlan = (plan) => {
    if (currentSubscription) {
      upgradeSubscriptionMutation.mutate({ planId: plan.id })
    } else {
      createSubscriptionMutation.mutate({ planId: plan.id })
    }
  }

  const handleCancelSubscription = () => {
    if (window.confirm('Are you sure you want to cancel your subscription?')) {
      cancelSubscriptionMutation.mutate()
    }
  }

  if (plansLoading || subscriptionLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 h-96 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Subscription Plans</h1>
        <p className="text-gray-600">
          Choose the perfect plan for your needs.
        </p>
      </div>

      {/* Current Subscription */}
      {currentSubscription && (
        <div className="bg-white shadow rounded-lg mb-8 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Current Subscription
            </h2>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
              currentSubscription.status === 'active' 
                ? 'bg-green-100 text-green-800'
                : currentSubscription.status === 'trialing'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {currentSubscription.status.charAt(0).toUpperCase() + currentSubscription.status.slice(1)}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Plan</p>
                <p className="text-gray-900">{currentSubscription.planName}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Current Period</p>
                <p className="text-gray-900">
                  {format(new Date(currentSubscription.currentPeriodEnd), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>

            <div className="flex space-x-2">
              {currentSubscription.cancelAtPeriodEnd ? (
                <button
                  onClick={() => reactivateSubscriptionMutation.mutate()}
                  disabled={reactivateSubscriptionMutation.isLoading}
                  className="btn-primary text-sm"
                >
                  {reactivateSubscriptionMutation.isLoading ? 'Reactivating...' : 'Reactivate'}
                </button>
              ) : (
                <button
                  onClick={handleCancelSubscription}
                  disabled={cancelSubscriptionMutation.isLoading}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md text-sm transition duration-200"
                >
                  {cancelSubscriptionMutation.isLoading ? 'Canceling...' : 'Cancel'}
                </button>
              )}
            </div>
          </div>

          {currentSubscription.cancelAtPeriodEnd && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Your subscription will be canceled on{' '}
                    {format(new Date(currentSubscription.currentPeriodEnd), 'MMMM dd, yyyy')}.
                    You can reactivate it anytime before then.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans?.map((plan) => {
          const isCurrentPlan = currentSubscription?.planId === plan.id
          const isPopular = plan.id === 'pro'
          
          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-lg shadow-md ${
                isPopular ? 'ring-2 ring-primary-500' : 'border border-gray-200'
              }`}
            >
              {isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-500 text-white px-3 py-1 text-sm font-medium rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-500">/month</span>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {plan.features?.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={
                    isCurrentPlan || 
                    createSubscriptionMutation.isLoading || 
                    upgradeSubscriptionMutation.isLoading
                  }
                  className={`w-full py-2 px-4 rounded-md font-medium transition duration-200 ${
                    isCurrentPlan
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : isPopular
                      ? 'btn-primary'
                      : 'btn-secondary'
                  }`}
                >
                  {isCurrentPlan 
                    ? 'Current Plan'
                    : createSubscriptionMutation.isLoading || upgradeSubscriptionMutation.isLoading
                    ? 'Processing...'
                    : currentSubscription
                    ? 'Switch Plan'
                    : 'Choose Plan'
                  }
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* FAQ or Additional Info */}
      <div className="mt-16">
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Can I change my plan anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated and reflected in your next billing cycle.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                What happens when I cancel?
              </h3>
              <p className="text-gray-600">
                When you cancel, you'll continue to have access to your plan features until the end of your current billing period. After that, your account will be downgraded to the free tier.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee for all paid plans. Contact support if you're not satisfied with your purchase.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionPage
