# Visualization

The "Visualization" page allows you to view your measurement data on an interactive graph. You can zoom in, zoom out, and navigate through time to explore your data intuitively.
It is also possible to correct, convert, and export your measurement data using the tools available in this section.

---

## File Import
To get started, click the "Start" button in the "Visualization" section. You can then select one or more files from your device.
Note that you can import multiple measurement files at the same time, allowing you to view data over a wide measurement period.
To perform the various correction, conversion, and export operations, you must also import a calibration file.

::: warning
**⚠️ Important:**
Accepted formats are CSV, DAT, XML, and MV for measurement data, and DAT and CSV for calibration files. Make sure your files are correctly formatted to avoid errors during import.
:::

Once your files are imported, you can view them on the interactive graph.

<img src="/img/doc/visualisation1.png" alt="FluoGraphiX Interface" style="width: 100%; max-width: 600px; display: block; margin: 20px auto;">

::: info
**💡 Tip:**
You can import a calibration file after importing your measurement data in the calculation and export utility.
:::

---

## Advanced Features
Several advanced features are available when importing files in the "Visualization" part of FluoGraphiX:

<details>
  <summary>Date Format</summary>
  <p>The default date format is dd/mm/yyyy. If you import a calibration file in DAT format, the format will be automatically applied. You can set the date format yourself in the dedicated drop-down list before importing your files.</p>
</details>

<details>
  <summary>Anomaly Detection Tool</summary>
  <p>If potentially incorrect data is detected in your calibration file, a box will warn you of the situation in the calculation and export utility.</p>
</details>

<details>
  <summary>Curve Renaming Tool</summary>
  <p>If the calibration data does not match the imported measurement data, the calculation and export utility will offer to rename them to match.</p>
</details>

<details>
  <summary>Automatic Rejection in Case of a Large Gap</summary>
  <p>If several measurement files have been imported, and a gap that is too large is detected between two of them, the import will be automatically canceled to avoid displaying a truncated graph.</p>
</details>

---

## Interactive Graph
The interactive graph allows you to visualize your measurement data intuitively. You can:
*   Zoom in and out to explore your data in detail.
*   Navigate through time to see the evolution of your measurements.
*   Show or hide the measurement and calibration curves according to your needs.

<img src="/img/doc/visualisation2.png" alt="FluoGraphiX Interface" style="width: 100%; max-width: 600px; display: block; margin: 20px auto;">

---

## Calculation and Export Utility
The calculation and export utility allows you to correct your measurement data, convert it into real concentrations, and export it in different formats.
To access this utility, you must first import at least one measurement file and one calibration file. Once these files are imported, you can:
*   Correct your measurement data by applying turbidity and background noise corrections.
*   Convert your tracers into concentrations.
*   Export your measurement data into a single CSV or TRAC file.
*   Delete measurement curves if necessary.

<img src="/img/doc/visualisation3.png" alt="FluoGraphiX Interface" style="width: 100%; max-width: 300px; display: block; margin: 20px auto;">

::: warning
**⚠️ Important:**
If your device's screen is not wide enough, the calculation and export utility will not be displayed.
:::

---

## Export
FluoGraphiX allows you to export your measurement data into a single CSV file, also available in TRAC format after converting at least one tracer.
Export is done in the calculation and export utility, after importing at least one measurement file and one calibration file.

When exporting in CSV format, you can also choose to export the details of the calculations performed. This option is only available if you have performed at least one correction or conversion calculation.

::: info
**💡 Tip:**
These files can themselves be imported into FluoGraphiX in the "Visualization" part.
:::

::: warning
**⚠️ Important:**
Export in TRAC format is not available if you have not converted at least one tracer to concentration.
:::

<img src="/img/doc/visualisation4.png" alt="FluoGraphiX Interface" style="width: 100%; max-width: 250px; display: block; margin: 20px auto;">

---

## Turbidity Correction
You can correct the incidence of turbidity on your curves by going to the dedicated tab of the calculation and export utility.

To do this, you must select the desired correction level, then select the lamps to be corrected, and finally click the "Calculate" button. FluoGraphiX will then apply the turbidity correction to your measurement data.

New curves will be created, with the suffix "_corr" added to their name. You can then view them in the interactive graph.

<img src="/img/doc/visualisation5.png" alt="FluoGraphiX Interface" style="width: 100%; max-width: 250px; display: block; margin: 20px auto;">

---

## Interference Correction

You can correct the interference generated by one or two tracers on your curves by going to the dedicated tab of the calculation and export utility.

Select the number of tracers to choose, then select your tracers.

Click "finish" to display the corrected curve(s) in your graph.

<img src="/img/doc/visualisation6.png" alt="FluoGraphiX Interface" style="width: 100%; max-width: 250px; display: block; margin: 20px auto;">

---

## Background Noise Correction

::: warning
**⚠️ Important:**
This correction is only available if you have performed an interference correction beforehand.
:::

You can also correct the background noise on one of your curves, representing a tracer.

To access this option, you must have corrected the interference of one or two tracers.

You can select the period of the graph influenced by the tracer.

::: warning
**⚠️ Important:**
This step is optional and should be done first.
:::

Then select the explanatory variables (curves) to be used for the calculation (minimum 2 curves selected, maximum 3). The curves selected by default are those that have been corrected ("Corr").

Click "calculate" to display the new calculated curve ("LxCorr") on the graph.

<img src="/img/doc/visualisation7.png" alt="FluoGraphiX Interface" style="width: 100%; max-width: 250px; display: block; margin: 20px auto;">

---

## Conversion to Concentration

You can convert your tracers into concentrations by going to the "Convert to concentration" tab.

The tracers are retrieved from the calibration file. Each tracer is associated with a curve, depending on its main lamp.

You can select a tracer to convert and then click "finish". The curve representing your tracer in concentration then appears.

::: info
**💡 Tip:**
You can then export this data for the TRAC software
:::

<img src="/img/doc/visualisation8.png" alt="FluoGraphiX Interface" style="width: 100%; max-width: 600px; display: block; margin: 20px auto;">


Thank you for reading this guide. We hope it will be useful to you in fully exploiting the potential of FluoGraphiX.
If you have any questions or suggestions, do not hesitate to contact us.