import "./Categorie.css"

interface StreetProps {
    name: string,
    isConfigured: boolean
    lastUpdateDate: string
  }

function StreetButton(street: StreetProps) {

  return (
    <div className="StreetButton" style={{ backgroundColor: street.isConfigured ? "blue" : "red"}}>
        <h3>{street.name}</h3>
        <p>{street.lastUpdateDate}</p>
    </div>
  );
}

export default StreetButton;