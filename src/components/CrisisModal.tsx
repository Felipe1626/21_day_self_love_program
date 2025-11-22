import React from "react";

type CrisisModalProps = {
  onClose: () => void;
};

const CrisisModal: React.FC<CrisisModalProps> = ({ onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex modal-overlay items-center justify-center p-4 " 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto transform transition-all shadow-2xl" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-3xl font-bold text-rescue-red flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.953 2C6.465 2 2 6.48 2 12s4.465 10 9.953 10c5.487 0 9.953-4.48 9.953-10S17.44 2 11.953 2zm-.99 15h1.98v-1.98h-1.98V17zm.058-2.973h.007c.552 0 .992-.44.992-.992v-4.004c0-.552-.44-.992-.992-.992h-.007c-.552 0-.992.44-.992.992v4.004c0 .552.44.992.992.992z"/>
            </svg>
            Plan de Rescate en Crisis de Dolor
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-700 transition duration-150 cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="text-gray-700 leading-relaxed space-y-4">
          <p className="font-semibold text-sm italic text-gray-600 border-b pb-2">
            Este plan se activa cuando surge una crisis o un momento difícil. Está diseñado para ayudarte a evaluar, sostenerte y cuidar de ti misma con amor y conciencia.
          </p>

          {/* 1. Evalúa la situación */}
          <div className="p-3 bg-red-50 rounded-lg border-l-4 border-rescue-red">
            <h3 className="font-extrabold text-xl text-rescue-red">1. Evalúa la Situación</h3>
            <p className="mt-1">Hazte esta pregunta:</p>
            <p className="mt-1 font-bold italic">"¿Necesito asistencia médica o puedo manejarlo en casa?"</p>
            <p className="text-sm mt-1">Si los síntomas son intensos o diferentes a lo habitual, <b>busca ayuda médica</b>.</p>
          </div>
          
          {/* 2. Si puedes manejarlo en casa */}
          <h3 className="font-extrabold text-xl text-primary-indigo border-b pb-1 pt-2">2. Si puedes manejarlo en casa...</h3>

          {/* 3. Respira conscientemente */}
          <div className="p-3 bg-indigo-50 rounded-lg">
            <h4 className="font-bold text-lg text-primary-indigo">3. Respira Consciente (3-5 minutos)</h4>
            <p className="text-sm">Inhala contando <b>4</b>, retén <b>2</b>, exhala <b>6</b>. Siente cómo el aire limpia tu cuerpo desde dentro.</p>
          </div>

          {/* 4. Conecta con un anclaje emocional */}
          <div className="p-3 bg-indigo-50 rounded-lg">
            <h4 className="font-bold text-lg text-primary-indigo">4. Conecta con un Anclaje Emocional</h4>
            <p className="text-sm">Toma algo suave o significativo (una piedra, peluche, amuleto). Recuerda: <span className="font-bold italic">"Esto también pasará"</span>.</p>
          </div>

          {/* 5. Música sanadora o sonidos naturales */}
          <div className="p-3 bg-indigo-50 rounded-lg">
            <h4 className="font-bold text-lg text-primary-indigo">5. Música Sanadora</h4>
            <p className="text-sm">Elige melodías suaves, cuencos tibetanos, olas del mar o sonidos del bosque; evita pantallas o noticias.</p>
          </div>

          {/* 6. Aplica calor o fresco */}
          <div className="p-3 bg-indigo-50 rounded-lg">
            <h4 className="font-bold text-lg text-primary-indigo">6. Aplica Calor o Fresco</h4>
            <p className="text-sm">Compresas tibias para contracturas, frías para inflamación. Hazlo con calma, cuidándote desde el amor.</p>
          </div>

          {/* 7. Visualización energética */}
          <div className="p-3 bg-indigo-50 rounded-lg">
            <h4 className="font-bold text-lg text-primary-indigo">7. Visualización Energética</h4>
            <p className="text-sm">Imagina una luz violeta recorriendo el área afectada. Con cada respiración, la luz <b>disuelve el dolor</b> y lo transforma en calma.</p>
          </div>

          {/* Después de la crisis */}
          <h3 className="font-extrabold text-xl text-primary-indigo border-b pb-1 pt-2">Después de la Crisis</h3>
          <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
            <li>Anota qué sentiste y qué te ayudó más.</li>
            <li>Agradece a tu cuerpo por resistir una vez más.</li>
            <li>Hazte una pequeña promesa amorosa: <span className="font-bold italic">"Mañana me cuidaré un poquito más."</span></li>
          </ul>

          {/* Intención del plan */}
          <div className="p-3 pt-8 pb-9 bg-violet-100 text-gray-700 rounded-lg mt-4">
            <h4 className="font-extrabold text-lg mb-1">Intención del Plan:</h4>
            <p className="text-sm">No es para eliminar el dolor, sino para transformar tu relación con él, aprender a escucharlo y responder con <b>compasión</b>, no con miedo. Es un recordatorio de tu fuerza interior.</p>
          </div>
        </div>
        
        <a 
          href="https://drive.google.com/file/d/1AUiyYs0so3Y5SRQc7g1zQ1d8R_WbdkVm/view?usp=drivesdk" target="_blank"
          className="mt-6 w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition duration-200 shadow-md cursor-pointer block text-center"
        >
          5 Pasos para manejar el Brote de Dolor
        </a>

        <button 
          onClick={onClose} 
          className="mt-6 w-full py-3 bg-rescue-red text-white font-semibold rounded-lg hover:bg-red-700 transition duration-200 shadow-md cursor-pointer"
        >
          Entendido, Cerrar Plan
        </button>
      </div>
    </div>
  );
};

export default CrisisModal;