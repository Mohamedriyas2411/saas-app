import { Link } from 'react-router-dom'
import { CheckCircle, Star, Users } from 'lucide-react'

const HomePage = () => {
  const features = [
    {
      icon: CheckCircle,
      title: 'Easy to Use',
      description: 'Intuitive interface designed for productivity'
    },
    {
      icon: Star,
      title: 'Premium Features',
      description: 'Access to advanced tools and analytics'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with your team'
    }
  ]

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Build Something Amazing
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              The complete SaaS platform to grow your business. Start your free trial today.
            </p>
            <div className="space-x-4">
              <Link to="/register" className="btn-primary bg-white text-primary-600 hover:bg-gray-50">
                Start Free Trial
              </Link>
              <Link to="/login" className="btn-secondary border-white text-white hover:bg-primary-800">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform provides all the tools you need to build, manage, and grow your business.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <feature.icon className="h-12 w-12 text-primary-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of satisfied customers today.
          </p>
          <Link to="/register" className="btn-primary bg-white text-primary-600 hover:bg-gray-50">
            Start Your Free Trial
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage
