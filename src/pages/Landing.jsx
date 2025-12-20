import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaHandHoldingHeart,
  FaShieldAlt,
  FaCheckCircle,
  FaUser,
  FaUserTie,
  FaUserShield,
  FaLock,
  FaChartLine,
} from 'react-icons/fa';

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-dark to-primary-light text-white py-16 md:py-20 px-4 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary opacity-10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent opacity-10 rounded-full -ml-24 -mb-24"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-6 backdrop-blur-sm">
              <FaHandHoldingHeart className="text-white text-4xl" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Give with dignity.<br />Help with trust.
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-neutral-light max-w-3xl mx-auto opacity-95 leading-relaxed">
            A compassionate share & donor platform where every contribution matters,
            every need is verified, and every donation can be anonymous.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/register?role=donor" className="bg-secondary hover:bg-secondary-dark text-white font-semibold py-4 px-10 rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl text-lg transform hover:scale-105">
              Donate Now
            </Link>
            <Link to="/register?role=receiver" className="bg-white text-primary hover:bg-neutral-light font-semibold py-4 px-10 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-lg transform hover:scale-105">
              Request Help
            </Link>
          </div>
          {/* Credibility Line */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm md:text-base text-neutral-light opacity-90">
            <span className="flex items-center gap-2">
              <FaShieldAlt className="text-secondary" />
              Verified requests
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-2">
              <FaLock className="text-secondary" />
              Anonymous donations
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-2">
              <FaChartLine className="text-secondary" />
              Transparent tracking
            </span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-text-dark">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple, transparent, and compassionate. Three easy steps to make a real difference.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center hover:border-secondary border-2 border-transparent transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <FaShieldAlt className="text-white text-3xl" />
              </div>
              <div className="mb-3">
                <span className="inline-block bg-secondary bg-opacity-10 text-secondary font-bold text-sm px-3 py-1 rounded-full mb-3">Step 1</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-text-dark">
                Verified Requests
              </h3>
              <p className="text-gray-600 leading-relaxed">
                All donation requests are carefully reviewed and verified by our
                admin team to ensure legitimacy and genuine need.
              </p>
            </div>

            <div className="card text-center hover:border-secondary border-2 border-transparent transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-secondary to-secondary-dark rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <FaLock className="text-white text-3xl" />
              </div>
              <div className="mb-3">
                <span className="inline-block bg-secondary bg-opacity-10 text-secondary font-bold text-sm px-3 py-1 rounded-full mb-3">Step 2</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-text-dark">
                Anonymous Donation
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Donate anonymously or publicly. Your choice. No judgment, no
                pressure. Every contribution is valued equally.
              </p>
            </div>

            <div className="card text-center hover:border-secondary border-2 border-transparent transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent-light rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <FaChartLine className="text-white text-3xl" />
              </div>
              <div className="mb-3">
                <span className="inline-block bg-secondary bg-opacity-10 text-secondary font-bold text-sm px-3 py-1 rounded-full mb-3">Step 3</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-text-dark">
                Tracked Delivery
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Follow your donation from start to finish. See exactly how your
                contribution helps and where it goes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-text-dark">
              Who We Serve
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A platform built for everyone who wants to share, give, and make a difference.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card border-2 border-primary">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4">
                  <FaHandHoldingHeart className="text-white text-xl" />
                </div>
                <h3 className="text-2xl font-semibold text-text-dark">Donor</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Make a difference with confidence. Browse verified requests,
                donate anonymously or publicly, and track your impact.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <FaCheckCircle className="text-accent mr-2" />
                  Verified donation requests
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-accent mr-2" />
                  Anonymous donation option
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-accent mr-2" />
                  Full donation tracking
                </li>
              </ul>
            </div>

            <div className="card border-2 border-accent">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mr-4">
                  <FaUser className="text-white text-xl" />
                </div>
                <h3 className="text-2xl font-semibold text-text-dark">Receiver</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Submit your verified request for help. Receive support with
                dignity and respect, maintaining your privacy.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <FaCheckCircle className="text-accent mr-2" />
                  Easy request submission
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-accent mr-2" />
                  Privacy protection
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-accent mr-2" />
                  Status tracking
                </li>
              </ul>
            </div>

            <div className="card border-2 border-accent">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mr-4">
                  <FaUserShield className="text-white text-xl" />
                </div>
                <h3 className="text-2xl font-semibold text-text-dark">Admin</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Manage the platform with transparency. Verify requests, monitor
                donations, and ensure trust throughout the system.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <FaCheckCircle className="text-accent mr-2" />
                  Request verification
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-accent mr-2" />
                  User management
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-accent mr-2" />
                  Analytics & reports
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Transparency Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-background to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-text-dark">
              Trust & Transparency
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We believe in complete transparency. Every request is verified,
              every donation is tracked, and every process is open.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="card">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <FaShieldAlt className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-text-dark">
                    Verified Requests Only
                  </h3>
                  <p className="text-gray-600">
                    All donation requests go through a thorough verification
                    process. We ensure that every need is genuine and legitimate
                    before it goes live.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <FaChartLine className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-text-dark">
                    Full Tracking & Reporting
                  </h3>
                  <p className="text-gray-600">
                    See exactly where your donation goes. Track the entire
                    journey from your contribution to the final delivery, with
                    complete transparency.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <FaLock className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-text-dark">
                    Privacy Protected
                  </h3>
                  <p className="text-gray-600">
                    Your privacy matters. Donate anonymously, request help
                    discreetly, and maintain your dignity throughout the
                    process.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <FaCheckCircle className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-text-dark">
                    No Judgment Policy
                  </h3>
                  <p className="text-gray-600">
                    Whether you give $5 or $5000, every donation is equally
                    valued. We create a judgment-free environment for both
                    donors and receivers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary via-primary-dark to-primary-light text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-secondary opacity-10 rounded-full -ml-20 -mt-20"></div>
        <div className="absolute bottom-0 right-0 w-56 h-56 bg-accent opacity-10 rounded-full -mr-28 -mb-28"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-6">
            <FaHandHoldingHeart className="text-white text-5xl mx-auto opacity-80" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-neutral-light opacity-95 leading-relaxed">
            Join our community of donors and receivers. Together, we can create
            positive change with dignity and trust.
          </p>
          <Link to="/register" className="inline-block bg-secondary hover:bg-secondary-dark text-white font-semibold py-4 px-10 rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl text-lg transform hover:scale-105">
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;

