import LogoDark from "@/public/logo-no-background.png";
import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/admin" legacyBehavior>
      <a>
        <Image src={LogoDark} alt="logo" width={150} height={150}/>
      </a>
    </Link>
  );
};

export default Logo;
