import { useState } from "react";
import DropDownOption from "#components/DropDown/DropDownOption.tsx";
import LateralMenuLayer from "#layers/LateralMenuLayer.tsx";
import TitleTextInput from "#components/TitleTextInput.tsx";
import TitleDropdown from "#components/TitleDropdown.tsx";
import Tabs from "#components/Tabs.tsx";
import { Close, ChevronRight, Home, Users, CaretDown } from "flowbite-react-icons/outline";
import { User } from "flowbite-react-icons/solid";
import Box from "#components/Box.tsx";
import Button from "#components/Button.tsx";
import { useNavigate } from "react-router";

function CreateCase() {
    const [activeStep, setActiveStep] = useState("identificacion");
    const navigate = useNavigate();

    return (
        <LateralMenuLayer locationId='createCase'>
            <Box className="p-0! overflow-hidden">
                <header className="bg-surface/70 flex items-center justify-between px-4 h-16">
                    <div className="flex items-center gap-2.5">
                        <User className="size-8!"/>
                        <h1 className="text-label-medium">Solicitante</h1>
                    </div>
                    <div className="flex items-end gap-2.5">
                        <Button onClick={()=>{navigate("/")}} variant="outlined" icon={<Close />} className="h-10">Cancelar</Button>
                        <Button variant="outlined" icon={<ChevronRight/>}>Siguiente</Button>
                    </div>
                </header>
                <section className="flex py-2">
                    <Tabs selectedId={activeStep} onChange={setActiveStep}>
                        <Tabs.Item id="identificacion" label="Identificación" icon={<CaretDown />} />
                        <Tabs.Item id="vivienda" label="Vivienda y Servicios" icon={<Home />} />
                        <Tabs.Item id="familia" label="Familia y Hogar" icon={<Users />} />
                    </Tabs>
                </section>
                <section className="grid grid-cols-12 gap-x-6 gap-y-6 p-4">
                    {/* Row 1 */}
                    <div className="col-span-5">
                        <TitleTextInput label="Cedula" placeholder="V-12345678" />
                    </div>
                    <div className="col-span-7">
                        <TitleTextInput label="Nombres y Apellidos" placeholder="Juan Perez" />
                    </div>

                    {/* Row 2 */}
                    <div className="col-span-3">
                        <TitleTextInput label="Fecha Nacimiento" placeholder="DD/MM/AAAA" />
                    </div>
                    <div className="col-span-2">
                        <TitleDropdown label="Sexo">
                            <DropDownOption value="M">Masculino</DropDownOption>
                            <DropDownOption value="F">Femenino</DropDownOption>
                        </TitleDropdown>
                    </div>
                    <div className="col-span-3">
                        <TitleDropdown label="Nacionalidad">
                            <DropDownOption value="V">Venezolana</DropDownOption>
                            <DropDownOption value="E">Extranjera</DropDownOption>
                        </TitleDropdown>
                    </div>
                    <div className="col-span-2">
                        <TitleDropdown label="Estado Civil">
                            <DropDownOption value="S">Soltero/a</DropDownOption>
                            <DropDownOption value="C">Casado/a</DropDownOption>
                        </TitleDropdown>
                    </div>
                    <div className="col-span-2">
                        <TitleDropdown label="Concubinato">
                            <DropDownOption value="SI">Si</DropDownOption>
                            <DropDownOption value="NO">No</DropDownOption>
                        </TitleDropdown>
                    </div>

                    {/* Row 3 */}
                    <div className="col-span-3">
                        <TitleTextInput label="Telefono Local" placeholder="0212-1234567" />
                    </div>
                    <div className="col-span-3">
                        <TitleTextInput label="Telefono Celular" placeholder="0414-1234567" />
                    </div>
                    <div className="col-span-6">
                        <TitleTextInput label="Correo Electronico" placeholder="ejemplo@correo.com" />
                    </div>

                    {/* Row 4 */}
                    <div className="col-span-4">
                        <TitleTextInput label="Periodo Educativo" placeholder="2024-2025" />
                    </div>
                    <div className="col-span-4">
                        <TitleDropdown label="Nivel de educacion">
                            <DropDownOption value="PRIMARIA">Primaria</DropDownOption>
                            <DropDownOption value="SECUNDARIA">Secundaria</DropDownOption>
                            <DropDownOption value="UNIVERSITARIA">Universitaria</DropDownOption>
                        </TitleDropdown>
                    </div>
                    
                    {/* Row 5 */}
                    <div className="col-span-4">
                        <TitleDropdown label="Condicion de Trabajo">
                            <DropDownOption value="EMPLEADO">Empleado</DropDownOption>
                            <DropDownOption value="DESEMPLEADO">Desempleado</DropDownOption>
                        </TitleDropdown>
                    </div>
                    <div className="col-span-4">
                        <TitleDropdown label="Condicion de Actividad">
                            <DropDownOption value="ACTIVO">Activo</DropDownOption>
                            <DropDownOption value="INACTIVO">Inactivo</DropDownOption>
                        </TitleDropdown>
                    </div>
                </section>
            </Box>
        </LateralMenuLayer>
    );
}
export default CreateCase;
