import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Zap,
  Play,
  MoreVertical,
  Edit,
  Trash,
  CloudLightning,
} from "lucide-react";
import SceneModal from "@/components/modals/SceneModal";
import * as signalDB from "@/lib/signalDatabase";

const Scenes = () => {
  const [scenes, setScenes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScene, setEditingScene] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load scenes from database
  useEffect(() => {
    const loadScenes = async () => {
      try {
        await signalDB.initDatabase();
        const scenesData = await signalDB.getAllItems("scenes");
        setScenes(scenesData || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load scenes:", error);
        setIsLoading(false);
      }
    };

    loadScenes();
  }, []);

  // Open modal for editing a scene
  const handleEditScene = (scene) => {
    setEditingScene(scene);
    setIsModalOpen(true);
  };

  // Open modal for creating a new scene
  const handleAddScene = () => {
    setEditingScene(null);
    setIsModalOpen(true);
  };

  // Activate a scene
  const handleActivateScene = async (sceneId) => {
    try {
      await signalDB.initDatabase();
      await signalDB.save("scenes", sceneId, {
        ...scenes.find((scene) => scene.id === sceneId),
        isActive: true,
        lastTriggered: Date.now(),
      });

      // Update scene in the UI
      setScenes(
        scenes.map((scene) => {
          if (scene.id === sceneId) {
            return { ...scene, isActive: true, lastTriggered: Date.now() };
          }
          return scene;
        })
      );
    } catch (error) {
      console.error("Failed to activate scene:", error);
    }
  };

  // Delete a scene
  const handleDeleteScene = async (sceneId) => {
    if (window.confirm("Are you sure you want to delete this scene?")) {
      try {
        await signalDB.initDatabase();
        await signalDB.deleteItem("scenes", sceneId);
        setScenes(scenes.filter((scene) => scene.id !== sceneId));
      } catch (error) {
        console.error("Failed to delete scene:", error);
      }
    }
  };

  // Handle modal close and refresh scenes
  const handleModalClose = async () => {
    setIsModalOpen(false);

    // Refresh scenes list
    try {
      await signalDB.initDatabase();
      const scenesData = await signalDB.getAllItems("scenes");
      setScenes(scenesData || []);
    } catch (error) {
      console.error("Failed to refresh scenes:", error);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-background">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-3xl font-display font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient"
          >
            Scenes
          </motion.h1>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-primary rounded-lg text-white flex items-center shadow-lg"
            onClick={handleAddScene}
          >
            <Plus size={18} className="mr-2" />
            Add Scene
          </motion.button>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm text-foreground/60 mt-1"
        >
          Create and manage automated sequences for your smart home
        </motion.p>
      </header>

      {/* Scenes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading ? (
          // Loading skeletons
          [...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="glass rounded-xl p-4 h-44 animate-pulse"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="w-10 h-10 rounded-lg bg-white/10 mb-3"></div>
              <div className="w-2/3 h-4 rounded-md bg-white/10 mb-2"></div>
              <div className="w-1/2 h-3 rounded-md bg-white/5 mb-6"></div>
              <div className="w-full h-12 rounded-lg bg-white/5"></div>
            </motion.div>
          ))
        ) : scenes.length === 0 ? (
          // Empty state
          <motion.div
            className="col-span-full flex flex-col items-center justify-center glass rounded-xl p-10 border border-dashed border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CloudLightning size={40} className="text-primary/40 mb-4" />
            <h3 className="text-lg font-medium mb-2">No scenes yet</h3>
            <p className="text-sm text-foreground/60 text-center mb-6 max-w-md">
              Scenes let you control multiple devices with a single tap. Create
              your first scene to get started.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-primary rounded-lg text-white flex items-center"
              onClick={handleAddScene}
            >
              <Plus size={18} className="mr-2" />
              Create First Scene
            </motion.button>
          </motion.div>
        ) : (
          // Scene cards
          scenes.map((scene, index) => (
            <motion.div
              key={scene.id}
              className="glass rounded-xl p-4 border border-white/5 hover:border-primary/20 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              layoutId={`scene-${scene.id}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary">
                    <Zap size={20} />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">{scene.name}</h3>
                    <p className="text-xs text-foreground/60">
                      {scene.actions?.length || 0} device
                      {scene.actions?.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="relative group">
                  <button className="p-2 rounded-lg hover:bg-white/10">
                    <MoreVertical size={16} />
                  </button>

                  {/* Dropdown menu */}
                  <div className="absolute right-0 top-full mt-1 w-36 glass rounded-lg border border-white/10 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    <button
                      className="w-full flex items-center px-3 py-2 hover:bg-white/10 rounded-t-lg"
                      onClick={() => handleEditScene(scene)}
                    >
                      <Edit size={14} className="mr-2 opacity-70" />
                      <span className="text-sm">Edit</span>
                    </button>
                    <button
                      className="w-full flex items-center px-3 py-2 hover:bg-white/10 text-rose-400 rounded-b-lg"
                      onClick={() => handleDeleteScene(scene.id)}
                    >
                      <Trash size={14} className="mr-2 opacity-70" />
                      <span className="text-sm">Delete</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Scene status */}
              {scene.lastTriggered && (
                <div className="glass rounded-lg py-1 px-2 text-xs flex items-center mb-3 w-max">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      scene.isActive ? "bg-green-500" : "bg-white/30"
                    } mr-2`}
                  ></div>
                  {scene.isActive ? "Active" : "Last run"}:{" "}
                  {new Date(scene.lastTriggered).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}

              {/* Play button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-gradient-to-r from-primary/20 to-primary/10 hover:from-primary/30 hover:to-primary/20 border border-primary/20 flex items-center justify-center transition-colors"
                onClick={() => handleActivateScene(scene.id)}
              >
                <Play size={16} className="mr-2 text-primary" />
                <span className="text-sm font-medium">Run Scene</span>
              </motion.button>
            </motion.div>
          ))
        )}
      </div>

      {/* Scene Modal */}
      <SceneModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        editScene={editingScene}
      />
    </div>
  );
};

export default Scenes;
