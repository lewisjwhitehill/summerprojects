import React, { useState } from "react";

function ServiceSelection({ onSelect }) {
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [selectedTo, setSelectedTo] = useState(null);

  const handleSelect = (service, type) => {
    if (type === 'from') {
      setSelectedFrom(service);
    } else {
      setSelectedTo(service);
    }

    // Trigger the callback function to pass selected services
    onSelect(service, type);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>
      <div>
        <h2>Select a Service to Convert **From**</h2>
        <button
          onClick={() => handleSelect('Spotify', 'from')}
          style={{ backgroundColor: selectedFrom === 'Spotify' ? 'lightblue' : '' }}
        >
          Spotify
        </button>
        <button
          onClick={() => handleSelect('Apple Music', 'from')}
          style={{ backgroundColor: selectedFrom === 'Apple Music' ? 'lightblue' : '' }}
        >
          Apple Music
        </button>
        <button
          onClick={() => handleSelect('YouTube Music', 'from')}
          style={{ backgroundColor: selectedFrom === 'YouTube Music' ? 'lightblue' : '' }}
        >
          YouTube Music
        </button>
        <button
          onClick={() => handleSelect('Amazon Music', 'from')}
          style={{ backgroundColor: selectedFrom === 'Amazon Music' ? 'lightblue' : '' }}
        >
          Amazon Music
        </button>
      </div>

      <div>
        <h2>Select a Service to Convert **To**</h2>
        <button
          onClick={() => handleSelect('Spotify', 'to')}
          style={{ backgroundColor: selectedTo === 'Spotify' ? 'lightgreen' : '' }}
        >
          Spotify
        </button>
        <button
          onClick={() => handleSelect('Apple Music', 'to')}
          style={{ backgroundColor: selectedTo === 'Apple Music' ? 'lightgreen' : '' }}
        >
          Apple Music
        </button>
        <button
          onClick={() => handleSelect('YouTube Music', 'to')}
          style={{ backgroundColor: selectedTo === 'YouTube Music' ? 'lightgreen' : '' }}
        >
          YouTube Music
        </button>
        <button
          onClick={() => handleSelect('Amazon Music', 'to')}
          style={{ backgroundColor: selectedTo === 'Amazon Music' ? 'lightgreen' : '' }}
        >
          Amazon Music
        </button>
      </div>
    </div>
  );
}

export default ServiceSelection;
