function TrustBadges() {
  const badges = [
    {
      icon: "🎉",
      title: "Completely free",
      description: "Build and download at no cost"
    },
    {
      icon: "✓",
      title: "ATS-friendly layouts",
      description: "Passes employer screening systems"
    },
    {
      icon: "🛡️",
      title: "Private by default",
      description: "Your data stays with you"
    }
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {badges.map((badge, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-3">{badge.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {badge.title}
              </h3>
              <p className="text-sm text-gray-600">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrustBadges;
