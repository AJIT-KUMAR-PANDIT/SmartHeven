import { useEffect, useState } from "react";
import { RoomOverview } from "../components/RoomOverview";
import { RoomDB } from "../database_lowdb/db";
import { useRoute } from "wouter";
import Bedroom from "../assets/rooms/bedroom.svg";
import Bathroom from "../assets/rooms/bathroom.svg";
import Kitchen from "../assets/rooms/kitchen.svg";
import LivingRoom from "../assets/rooms/living-room.svg";
import Hallway from "../assets/rooms/hallway.svg";
import MediaRoom from "../assets/rooms/media-room.svg";
import Office from "../assets/rooms/office.svg";
import Other from "../assets/rooms/other_generic_room_svg.svg";
const RoomsPage = () => {
  const [route, navigate] = useRoute();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const roomImages = {
    bedroom: Bedroom,
    bathroom: Bathroom,
    kitchen: Kitchen,
    LivingRoom: LivingRoom,
    hallway: Hallway,
    media_room: MediaRoom,
    office: Office,
    other: Other,
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        console.log("Fetching rooms from RoomDB...");
        const allRooms = await RoomDB.getAllItems("rooms");
        console.log("Raw rooms data:", allRooms);

        if (!allRooms || allRooms.length === 0) {
          console.warn("No rooms found in database");
          setRooms([]);
          return;
        }

        const roomsWithImages = Object.entries(allRooms).map(([id, room]) => ({
          ...room,
          id,
          image: roomImages[room.type] || roomImages.other,
        }));

        console.log("Processed rooms:", roomsWithImages);
        setRooms(roomsWithImages);
      } catch (error) {
        console.error("Error loading rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading rooms...</div>;
  }

  const handleEditRoom = (roomId) => {
    navigate(`/rooms/edit/${roomId}`);
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      await RoomDB.deleteItem("rooms", roomId);
      setRooms(rooms.filter((room) => room.id !== roomId));
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  const handleAddDevice = (roomId) => {
    navigate(`/devices/add?roomId=${roomId}`);
  };

  const handleShowDevices = (roomId) => {
    setSelectedRoomId(roomId === selectedRoomId ? null : roomId);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">All Rooms</h1>
        <button
          onClick={() => navigate("/rooms/add")}
          className="bg-primary text-white px-4 py-2 rounded-lg"
        >
          Add New Room
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <RoomOverview
            key={room.id}
            roomData={room}
            onEdit={handleEditRoom}
            onDelete={handleDeleteRoom}
            onAddDevice={handleAddDevice}
            onShowDevices={handleShowDevices}
            roomImages={roomImages}
          />
        ))}
      </div>

      {selectedRoomId && (
        <div className="mt-6 p-4 glass rounded-xl">
          <h2 className="text-xl font-bold mb-4">Devices in Room</h2>
          {/* Device list component would go here */}
        </div>
      )}
    </div>
  );
};

export default RoomsPage;
