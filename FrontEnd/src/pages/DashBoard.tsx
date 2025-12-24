import Box from "#components/Box.tsx";
import Button from "#components/Button.tsx";
import LateralMenuLayer from "#layers/LateralMenuLayer.tsx";

function DashBoard() {
    return (
        <LateralMenuLayer locationId='home'>
            <div className="flex flex-col gap-3 h-full">
                <section className="flex">
                    <Button className="h-14 w-3xs">
                        Nuevo Caso
                    </Button>
                </section>
                <section className="grid grid-cols-6 gap-3 flex-1">
                    <Box className="col-span-4 h-full">hola</Box>
                    <Box className="col-span-2">hola</Box>
                </section>
            </div>
        </LateralMenuLayer>
    );
}
export default DashBoard;