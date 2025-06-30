# Calibration

The "Calibration" page allows you to view your calibration data on an interactive graph and a table. You can zoom in, zoom out, and navigate the graph to explore your data intuitively.
This allows you to ensure the quality of your calibration data before using it to correct your measurements, for example.

---

## File Import
To get started, click the "Start" button in the "Calibration" section. You can then select a file from your device.

::: warning
**⚠️ Important:**
Accepted formats are DAT and CSV for calibration files. Make sure your file is correctly formatted to avoid errors during import.
:::

::: info
**💡 Tip:**
Any fluorometer that provides a raw signal can be used.
:::

Once your files are imported, the data is displayed on the page for your first tracer and its main lamp.

<img src="/img/doc/calibration2.png" alt="FluoGraphiX Interface" style="width: 100%; max-width: 600px; display: block; margin: 20px auto;">

---

## Calibration CSV File
The calibration CSV file is offered to you for export after importing your calibration DAT file. It allows you to centralize your calibration data in a file that is easy to read and manipulate. You can thus correct your calibration data very easily, for example by using a spreadsheet.

::: info
**💡 Tip:**
These calibration files in CSV format can of course be imported into FluoGraphiX for later use.
:::

The file header provides you with the necessary important information of the measurements, such as the date of the export or the number of the associated measuring device.

::: warning
**⚠️ Important:**
This part must not be modified, at the risk of disrupting the proper functioning of the tool when importing the file.
:::

<img src="/img/doc/calibration1.png" alt="FluoGraphiX Interface" style="width: 100%; max-width: 600px; display: block; margin: 20px auto;">

Other information is also displayed, such as a simple summary of how this file works.

::: warning
**⚠️ Important:**
CSV calibration files must always respect the same order of tracers, so as not to display corrupted data later.
Water must always be placed in the first position in the file, while turbidity must always be placed in the last position.
:::

The other tracers must therefore be between these two parts of the file, in no specific order.

::: info
**💡 Tip:**
For each tracer, you can thus find its name, its measurement date, its unit, and its values.
:::

---

## Data Display
Your calibration data is displayed for a given tracer and lamp. You can navigate between tracers and lamps using the buttons at the top of the page.
The data is displayed as an interactive graph and a table, which allows you to easily view the values.

When you select a tracer to display, the associated main lamp is automatically selected. However, you can change the lamp by choosing another lamp from the list at the top of the page.

<img src="/img/doc/calibration2.png" alt="FluoGraphiX Interface" style="width: 100%; max-width: 600px; display: block; margin: 20px auto;">