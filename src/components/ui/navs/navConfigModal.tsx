import { Button } from "@nextui-org/react";

export default function NavConfigModal() {
  return (
    <div className="flex flex-col gap-2 absolute top-[-50px] left-[200%] bg-black rounded-md p-3">
      <Button color="secondary">Cadastrar</Button>
      <Button color="primary">Fazer login</Button>
    </div>
  );
}
