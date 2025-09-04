import subprocess
import time
import pygetwindow as gw
from screeninfo import get_monitors
from pywinauto import Application
from pynput.keyboard import Controller, Key

URL = "https://nutrifood-viandas.netlify.app/"
ESPERA_MAXIMA = 20  # segundos máximo para esperar la ventana

def esperar_ventana_nueva(titulos_antes, timeout=ESPERA_MAXIMA):
    """Espera hasta que aparezca una ventana nueva de Firefox distinta a las anteriores."""
    inicio = time.time()
    while time.time() - inicio < timeout:
        ventanas = [w for w in gw.getAllWindows() if "Mozilla Firefox" in w.title]
        for w in ventanas:
            if w.title not in titulos_antes:
                return w
        time.sleep(0.5)
    return None

def main():
    # Guardar ventanas Firefox antes de abrir
    ventanas_antes = set(w.title for w in gw.getAllWindows() if "Mozilla Firefox" in w.title)

    # Abrir nueva ventana de Firefox
    subprocess.Popen(["start", "firefox", "-new-window", URL], shell=True)

    print("Esperando a que se abra la nueva ventana de Firefox...")
    nueva_ventana = esperar_ventana_nueva(ventanas_antes)

    if not nueva_ventana:
        print(f"No se encontró una nueva ventana de Firefox en {ESPERA_MAXIMA} segundos.")
        return

    print(f"Ventana encontrada: {nueva_ventana.title}")

    monitores = get_monitors()
    if len(monitores) < 2:
        print("Solo se detectó un monitor. No se moverá la ventana.")
    else:
        segundo = monitores[1]
        # Restaurar y mover al segundo monitor
        nueva_ventana.restore()
        nueva_ventana.moveTo(segundo.x + 50, segundo.y + 50)
        print(f"Ventana movida al segundo monitor en ({segundo.x + 50}, {segundo.y + 50})")

    try:
        # Usar pywinauto para forzar foco
        app = Application(backend="uia").connect(title_re=nueva_ventana.title)
        dlg = app.window(title_re=nueva_ventana.title)
        dlg.set_focus()
        time.sleep(0.5)

        # Click en el centro para asegurar foco real
        cx = nueva_ventana.left + nueva_ventana.width // 2
        cy = nueva_ventana.top + nueva_ventana.height // 2
        import pyautogui
        pyautogui.click(cx, cy)
        time.sleep(0.3)

        # Enviar F11 con pynput
        keyboard = Controller()
        keyboard.press(Key.f11)
        keyboard.release(Key.f11)

        print("Pantalla completa activada.")
    except Exception as e:
        print(f"Error al activar pantalla completa: {e}")

if __name__ == "__main__":
    main()