import MainLayout from "../Components/ui/layout/MainLayout";
import { NegocioCompleto } from "../Components/ui/negocioCompleto/NegocioCompleto";

const NegocioCompletoView = () => {
  return (
    <MainLayout modo="sinOp">
      <NegocioCompleto />
    </MainLayout>
  );
};

export default NegocioCompletoView;
