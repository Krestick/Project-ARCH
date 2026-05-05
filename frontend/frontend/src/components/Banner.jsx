import banner from "../img/img2.webp";

export default function Banner() {
  return (
    <div
      className="presentation"
      style={{ backgroundImage: `url(${banner})` }}
    >
      <h1>Best clothes in a world</h1>
      <p>Best experience</p>
    </div>
  );
}