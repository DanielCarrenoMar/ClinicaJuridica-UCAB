import DropDownOption from "#components/DropDown/DropDownOption.tsx";
import LateralMenuLayer from "#layers/LateralMenuLayer.tsx";
import TitleTextInput from "#components/TitleTextInput.tsx";
import TitleDropdown from "#components/TitleDropdown.tsx";
import { User, Close, ChevronRight, Home, Users, CaretDown } from "flowbite-react-icons/outline";

function CreateCase() {
    return (
        <LateralMenuLayer locationId='createCase'>
            <div className="bg-white/40 rounded-xl overflow-hidden w-full h-full relative p-6">
                {/* Header */}
                <div className="bg-white/70 flex items-center justify-between px-4 py-2.5 rounded-xl mb-6">
                    <div className="flex items-center gap-2.5">
                        <div className="size-7 bg-[#10141A] rounded-full flex items-center justify-center text-white">
                            <User className="size-4" />
                        </div>
                        <p className="font-['Poppins'] text-[22px] text-[#10141A]">Solicitante</p>
                    </div>
                    <div className="flex gap-2.5">
                        <button className="bg-white border border-[#202020] flex gap-2.5 h-10 items-center px-4 py-2.5 rounded-full cursor-pointer hover:bg-gray-50 transition-colors">
                            <Close className="size-4.5 text-[#202020]" />
                            <span className="font-['Poppins'] text-[13px] text-[#202020]">Cancelar</span>
                        </button>
                        <button className="bg-white border border-[#202020] flex gap-2.5 h-10 items-center px-4 py-2.5 rounded-full cursor-pointer hover:bg-gray-50 transition-colors">
                            <span className="font-['Poppins'] text-[13px] text-[#202020]">Siguiente</span>
                            <ChevronRight className="size-4.5 text-[#202020]" />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-8 border-b border-[#10141A]/10">
                    <div className="flex gap-8">
                        <div className="flex items-center gap-1.5 px-9 py-1.5 border-b-2 border-[#4990E2] cursor-pointer">
                            <CaretDown className="size-5 text-[#10141A]" />
                            <span className="font-['Poppins'] font-medium text-[13px] text-[#10141A]">Identificación</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-9 py-1.5 border-b border-transparent opacity-40 cursor-pointer hover:opacity-70 transition-opacity">
                            <Home className="size-5 text-[#10141A]" />
                            <span className="font-['Poppins'] font-medium text-[13px] text-[#10141A]">Vivienda y Servicios</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-9 py-1.5 border-b border-transparent opacity-40 cursor-pointer hover:opacity-70 transition-opacity">
                            <Users className="size-5 text-[#10141A]" />
                            <span className="font-['Poppins'] font-medium text-[13px] text-[#10141A]">Familia y Hogar</span>
                        </div>
                    </div>
                </div>

                {/* Form Grid */}
                <div className="grid grid-cols-12 gap-x-6 gap-y-6 max-w-5xl mx-auto">
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
                </div>
            </div>
        </LateralMenuLayer>
    );
}
export default CreateCase;
