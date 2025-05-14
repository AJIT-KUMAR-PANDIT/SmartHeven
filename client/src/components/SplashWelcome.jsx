import { useState, useEffect } from "react";

const SplashWelcome = () => {
  const [visible, setVisible] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = currentTime.getHours();

    if (hour >= 5 && hour < 12) {
      return "Good Morning";
    } else if (hour >= 12 && hour < 17) {
      return "Good Afternoon";
    } else if (hour >= 17 && hour < 22) {
      return "Good Evening";
    } else {
      return "Good Night";
    }
  };

  // Format time as HH:MM AM/PM
  const formatTime = () => {
    return currentTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    // Set up timer to hide modal after 5 seconds
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clean up timers on unmount
    return () => {
      clearTimeout(timer);
      clearInterval(timeInterval);
    };
  }, []);

  // If not visible, don't render anything
  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
      <div className="bg-[#4fa6ceac] bg-opacity-50 backdrop-blur-md p-8 rounded-lg shadow-lg z-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome</h1>
        <p className="text-xl mb-2">{getGreeting()}</p>
        <p className="text-lg">{formatTime()}</p>
      </div>
    </div>
  );
};

export default SplashWelcome;
