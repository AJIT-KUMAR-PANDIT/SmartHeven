import { useState } from "react";
import { motion } from "framer-motion";
import {
  Moon,
  Sun,
  Monitor,
  Lock,
  Bell,
  LayoutGrid,
  Users,
  Database,
  Trash2,
  Eye,
  EyeOff,
  Check,
  X,
} from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider.jsx";
import ThemeToggle from "@/components/ThemeToggle";

const SettingSection = ({ title, icon: Icon, children }) => {
  return (
    <motion.div
      className="glass rounded-xl p-5 neumorphic mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mr-3">
          <Icon className="text-primary" size={20} />
        </div>
        <h3 className="text-lg font-medium">{title}</h3>
      </div>

      <div className="space-y-4">{children}</div>
    </motion.div>
  );
};

const ToggleSetting = ({ label, description, enabled, onToggle }) => {
  return (
    <div className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg transition">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-foreground/60">{description}</p>
      </div>
      <div className="relative inline-flex" onClick={onToggle}>
        <input type="checkbox" className="sr-only" checked={enabled} readOnly />
        <motion.div
          className={`block w-14 h-8 rounded-full transition-colors duration-200 ${
            enabled ? "bg-primary" : "bg-white/10"
          }`}
          animate={{
            backgroundColor: enabled
              ? "hsl(var(--primary))"
              : "rgba(255, 255, 255, 0.1)",
          }}
        />
        <motion.div
          className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full"
          animate={{ x: enabled ? 24 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
    </div>
  );
};

const Settings = () => {
  const { theme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [powerSavingEnabled, setPowerSavingEnabled] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleReset = () => {
    if (!resetConfirm) {
      setResetConfirm(true);
      setTimeout(() => {
        setResetConfirm(false);
      }, 3000);
    } else {
      // Reset functionality would go here
      setResetConfirm(false);
    }
  };

  return (
    <div className="min-h-screen pb-28 md:pb-6 bg-background">
      <div className="p-4 md:p-6">
        <header className="mb-6">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-3xl font-display font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient"
          >
            Settings
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm text-foreground/60"
          >
            Customize your SmartHaven experience
          </motion.p>
        </header>

        {/* Theme Settings */}
        <SettingSection title="Appearance" icon={Moon}>
          <ThemeToggle />

          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">
              Current Theme:{" "}
              <span className="text-primary capitalize">{theme}</span>
            </h4>
            <div className="glass rounded-lg p-4 flex items-center">
              <div className="flex-1">
                <p className="text-sm">
                  {theme === "dark"
                    ? "Dark theme preserves battery on OLED screens"
                    : theme === "light"
                    ? "Light theme improves readability in bright environments"
                    : "System theme automatically adapts to your device settings"}
                </p>
              </div>
              <div className="ml-4">
                {theme === "dark" ? (
                  <Moon className="text-primary" size={24} />
                ) : theme === "light" ? (
                  <Sun className="text-warning" size={24} />
                ) : (
                  <Monitor className="text-foreground/70" size={24} />
                )}
              </div>
            </div>
          </div>
        </SettingSection>

        {/* Notification Settings */}
        <SettingSection title="Notifications" icon={Bell}>
          <ToggleSetting
            label="Push Notifications"
            description="Get alerts about device status and events"
            enabled={notificationsEnabled}
            onToggle={() => setNotificationsEnabled(!notificationsEnabled)}
          />

          <div className="p-3">
            <p className="text-sm font-medium mb-2">Notification Schedule</p>
            <motion.select
              className="w-full glass px-3 py-2 rounded-lg text-sm bg-transparent cursor-pointer"
              whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              whileTap={{ scale: 0.98 }}
              disabled={!notificationsEnabled}
            >
              <option value="always">Always</option>
              <option value="day">Day time only (8AM - 10PM)</option>
              <option value="custom">Custom schedule</option>
            </motion.select>
          </div>
        </SettingSection>

        {/* Privacy Settings */}
        <SettingSection title="Privacy & Security" icon={Lock}>
          <ToggleSetting
            label="Location Services"
            description="Allow app to use your location for automations"
            enabled={locationEnabled}
            onToggle={() => setLocationEnabled(!locationEnabled)}
          />

          <ToggleSetting
            label="Analytics"
            description="Share anonymous usage data to improve our service"
            enabled={analyticsEnabled}
            onToggle={() => setAnalyticsEnabled(!analyticsEnabled)}
          />

          <ToggleSetting
            label="Biometric Authentication"
            description="Use Face ID or fingerprint to authenticate"
            enabled={biometricsEnabled}
            onToggle={() => setBiometricsEnabled(!biometricsEnabled)}
          />

          <div className="p-3">
            <p className="text-sm font-medium mb-2">App Password</p>
            <div className="flex">
              <div className="relative flex-1">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full h-10 pl-3 pr-10 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-primary/50"
                  value="••••••••••••"
                  readOnly
                />
                <button
                  className="absolute right-3 top-2.5 text-foreground/60"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <motion.button
                className="ml-2 px-3 py-2 glass rounded-lg text-xs"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Change
              </motion.button>
            </div>
          </div>
        </SettingSection>

        {/* General Settings */}
        <SettingSection title="General" icon={LayoutGrid}>
          <ToggleSetting
            label="Power Saving Mode"
            description="Reduce animations and background processes"
            enabled={powerSavingEnabled}
            onToggle={() => setPowerSavingEnabled(!powerSavingEnabled)}
          />

          <div className="p-3">
            <p className="text-sm font-medium mb-2">Data Storage</p>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: "65%" }}
                transition={{ duration: 1 }}
              ></motion.div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-foreground/60">3.2 GB used</span>
              <span className="text-xs text-foreground/60">5 GB total</span>
            </div>
          </div>

          <div className="p-3">
            <p className="text-sm font-medium mb-2">Connected Accounts</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="glass p-2 rounded-lg text-center">
                <Users size={16} className="mx-auto mb-1" />
                <span className="text-xs">Family</span>
              </div>
              <div className="glass p-2 rounded-lg text-center">
                <Database size={16} className="mx-auto mb-1" />
                <span className="text-xs">Cloud</span>
              </div>
            </div>
          </div>
        </SettingSection>

        {/* Reset Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="glass rounded-xl p-5 border border-danger/20">
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Trash2 className="text-danger mr-2" size={20} />
              Reset Application
            </h3>
            <p className="text-sm text-foreground/60 mb-4">
              This action will reset all settings and data to factory defaults.
              This cannot be undone.
            </p>
            <motion.button
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
                resetConfirm ? "bg-danger text-white" : "glass text-danger"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
            >
              {resetConfirm ? (
                <>
                  <Check className="mr-2" size={16} />
                  Confirm Reset
                </>
              ) : (
                <>
                  <Trash2 className="mr-2" size={16} />
                  Reset All Data
                </>
              )}
            </motion.button>
            {resetConfirm && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="ml-2 px-4 py-2 rounded-lg text-sm font-medium glass flex items-center mt-2"
                onClick={() => setResetConfirm(false)}
              >
                <X className="mr-2" size={16} />
                Cancel
              </motion.button>
            )}
          </div>
        </motion.div>

        <div className="mt-8 text-center text-xs text-foreground/40">
          <p>SmartHaven v1.0.3</p>
          <p className="mt-1">© 2025 SmartHaven. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
