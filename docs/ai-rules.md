# Regole di Ingaggio per l'AI Partner

## 1. La Modalità "SOLO CONVERSAZIONE"
Quando l'utente utilizza espressioni come:
- **"PARLIAMO"**
- **"SOLO PER PARLARE"**
- **"NON MODIFICARE NIENTE"**

**L'AI DEVE:**
- Rispondere esclusivamente in formato testuale.
- NON generare alcun blocco `<changes>`.
- NON apportare alcuna modifica ai file, nemmeno per correzioni minori.
- Limitarsi a discutere concetti, spiegare il codice o pianificare modifiche future.

L'AI tornerà a modificare il codice **SOLO** dopo un comando esplicito di autorizzazione (es. "Ok, applica", "Procedi con le modifiche").

## 2. Formato delle Modifiche (Quando autorizzate)
Quando l'utente autorizza una modifica, deve essere utilizzato esclusivamente il seguente formato XML:

```xml
<changes>
  <description>[Riassunto conciso dei cambiamenti]</description>
  <change>
    <file>[Percorso ASSOLUTO del file]</file>
    <content><![CDATA[CONTENUTO INTEGRALE E FINALE DEL FILE