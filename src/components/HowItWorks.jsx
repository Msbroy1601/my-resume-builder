function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Fill details",
      description: "Add your info in simple forms"
    },
    {
      number: "2",
      title: "Choose template",
      description: "Pick from 8 professional designs"
    },
    {
      number: "3",
      title: "Download for free",
      description: "100% free — yours to keep forever"
    }
  ];

  return (
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
