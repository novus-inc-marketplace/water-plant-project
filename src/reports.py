"""Reports module - generates PDF and Excel reports for water quality analysis"""

from typing import Dict, List, Any
import io
import base64
from datetime import datetime

try:
    from jinja2 import Template
    import pandas as pd
    from weasyprint import HTML
    import xlsxwriter
    REPORTS_AVAILABLE = True
    EXCEL_AVAILABLE = True
except Exception:
    # Track availability per library so Excel can work even without WeasyPrint
    REPORTS_AVAILABLE = False
    EXCEL_AVAILABLE = False
    _pdf_ok = False
    _excel_ok = False
    try:
        from jinja2 import Template  # noqa: F401
        import pandas as pd  # noqa: F401
        from weasyprint import HTML  # noqa: F401
        _pdf_ok = True
    except Exception:
        pass
    try:
        import xlsxwriter  # noqa: F401
        _excel_ok = True
    except Exception:
        pass
    REPORTS_AVAILABLE = _pdf_ok
    EXCEL_AVAILABLE = _excel_ok
    if not REPORTS_AVAILABLE:
        print("Warning: PDF report generation unavailable (WeasyPrint native libraries missing).")
    if not EXCEL_AVAILABLE:
        print("Warning: Excel report generation unavailable. Install with: pip install xlsxwriter")

def generate_pdf_report(
    input_data: Dict[str, Any],
    dosage_data: Dict[str, Any],
    compliance_data: Dict[str, Any],
    confidence_index: float
) -> bytes:
    """
    Generate a PDF report of the water quality analysis.

    Args:
        input_data: Raw water quality input
        dosage_data: Calculated chemical dosages
        compliance_data: Compliance check results
        confidence_index: Model confidence score (0-100)

    Returns:
        PDF report as bytes
    """
    if not REPORTS_AVAILABLE:
        raise ImportError("Report generation dependencies not available")

    # HTML template for the report
    html_template = """
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Water Quality Treatment Report</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #2c3e50; text-align: center; }
            h2 { color: #3498db; border-bottom: 2px solid #ecf0f1; }
            .section { margin: 30px 0; }
            .data-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .data-table th, .data-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            .data-table th { background-color: #f2f2f2; }
            .pass { color: #27ae60; font-weight: bold; }
            .fail { color: #e74c3c; font-weight: bold; }
            .confidence { text-align: center; font-size: 24px; margin: 20px 0; }
            .header-info { text-align: center; margin-bottom: 30px; }
            .footer { margin-top: 40px; text-align: center; color: #7f8c8d; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="header-info">
            <h1>Water Quality Treatment Analysis Report</h1>
            <p>Generated on {{ timestamp }}</p>
        </div>

        <div class="section">
            <h2>Input Water Quality Data</h2>
            <table class="data-table">
                <tr><th>Parameter</th><th>Value</th><th>Unit</th></tr>
                <tr><td>Turbidity</td><td>{{ input.turbidity }}</td><td>NTU</td></tr>
                <tr><td>Iron</td><td>{{ input.iron }}</td><td>mg/L</td></tr>
                <tr><td>Manganese</td><td>{{ input.manganese }}</td><td>mg/L</td></tr>
                <tr><td>Ammonia-N</td><td>{{ input.ammonia }}</td><td>mg/L as N</td></tr>
                <tr><td>pH</td><td>{{ input.ph }}</td><td>pH units</td></tr>
                <tr><td>Color</td><td>{{ input.color }}</td><td>TCU</td></tr>
            </table>
        </div>

        <div class="section">
            <h2>Recommended Chemical Dosages</h2>
            <table class="data-table">
                <tr><th>Chemical</th><th>Dosage</th><th>Unit</th></tr>
                <tr><td>Alum</td><td>{{ dosage.alum_dose }}</td><td>mg/L</td></tr>
                <tr><td>Soda Ash</td><td>{{ dosage.soda_ash_dose }}</td><td>mg/L</td></tr>
                <tr><td>Chlorine</td><td>{{ dosage.chlorine_dose }}</td><td>mg/L</td></tr>
                <tr><td>Calcium Hypochlorite</td><td>{{ dosage.disc_dose }}</td><td>mg/L</td></tr>
            </table>
        </div>

        <div class="section">
            <h2>Predicted Post-Treatment Water Quality</h2>
            <table class="data-table">
                <tr><th>Parameter</th><th>Predicted Value</th><th>Unit</th><th>WHO Limit</th></tr>
                <tr><td>Turbidity</td><td>{{ '%.3f'|format(dosage.predicted_turbidity) }}</td><td>NTU</td><td>< 1.0 (preferred)</td></tr>
                <tr><td>Iron</td><td>{{ '%.3f'|format(dosage.predicted_iron) }}</td><td>mg/L</td><td>< 0.3</td></tr>
                <tr><td>Manganese</td><td>{{ '%.3f'|format(dosage.predicted_manganese) }}</td><td>mg/L</td><td>< 0.1</td></tr>
                <tr><td>Ammonia-N</td><td>{{ '%.3f'|format(dosage.predicted_ammonia) }}</td><td>mg/L as N</td><td>< 1.5</td></tr>
                <tr><td>pH</td><td>{{ '%.3f'|format(dosage.predicted_ph) }}</td><td>pH units</td><td>6.5 - 8.5</td></tr>
            </table>
        </div>

        <div class="section">
            <h2>Compliance Assessment</h2>
            <p class="{{ 'pass' if compliance.status == 'PASS' else 'fail' }}">
                Overall Status: {{ compliance.status }}
            </p>
            {% if compliance.violations %}
            <h3>Violations Detected:</h3>
            <table class="data-table">
                <tr><th>Parameter</th><th>Value</th><th>Limit</th><th>Unit</th><th>Notes</th></tr>
                {% for violation in compliance.violations %}
                <tr>
                    <td>{{ violation.parameter }}</td>
                    <td>{{ '%.3f'|format(violation.value) }}</td>
                    <td>{{ violation.limit }}</td>
                    <td>{{ violation.unit }}</td>
                    <td>{{ violation.note }}</td>
                </tr>
                {% endfor %}
            </table>
            {% else %}
            <p>All parameters within WHO standards.</p>
            {% endif %}
        </div>

        <div class="section">
            <h2>Model Confidence Index</h2>
            <div class="confidence">
                Confidence: {{ "%.1f"|format(confidence_index) }}%
            </div>
            <p>
                {% if confidence_index >= 90 %}
                High confidence - results are reliable
                {% elif confidence_index >= 70 %}
                Moderate confidence - results are reasonably reliable
                {% elif confidence_index >= 50 %}
                Low confidence - consider additional verification
                {% else %}
                Preliminary confidence - results should be validated with additional testing
                {% endif %}
            </p>
        </div>

        <div class="footer">
            <p>Water Quality Treatment Software - Generated for River Ndarugu Water Treatment Plant</p>
            <p>This report is for informational purposes only. Always consult with water treatment professionals.</p>
        </div>
    </body>
    </html>
    """

    # Render the template
    template = Template(html_template)
    html_content = template.render(
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        input=input_data,
        dosage=dosage_data,
        compliance=compliance_data,
        confidence_index=confidence_index
    )

    # Generate PDF
    pdf_bytes = HTML(string=html_content).write_pdf()
    return pdf_bytes

def generate_excel_report(
    input_data: Dict[str, Any],
    dosage_data: Dict[str, Any],
    compliance_data: Dict[str, Any],
    confidence_index: float
) -> bytes:
    """
    Generate an Excel report of the water quality analysis.

    Args:
        input_data: Raw water quality input
        dosage_data: Calculated chemical dosages
        compliance_data: Compliance check results
        confidence_index: Model confidence score (0-100)

    Returns:
        Excel report as bytes
    """
    if not EXCEL_AVAILABLE:
        raise ImportError("Excel report dependencies (xlsxwriter) not available")

    # Create Excel workbook in memory
    output = io.BytesIO()
    workbook = xlsxwriter.Workbook(output)
    worksheet = workbook.add_worksheet('Water Quality Analysis')

    # Define formats
    header_format = workbook.add_format({
        'bold': True,
        'font_color': 'white',
        'bg_color': '#2c3e50',
        'border': 1
    })

    title_format = workbook.add_format({
        'bold': True,
        'font_size': 16,
        'align': 'center',
        'valign': 'vcenter'
    })

    section_format = workbook.add_format({
        'bold': True,
        'font_size': 14,
        'bg_color': '#ecf0f1',
        'border': 1
    })

    pass_format = workbook.add_format({
        'font_color': '#27ae60',
        'bold': True
    })

    fail_format = workbook.add_format({
        'font_color': '#e74c3c',
        'bold': True
    })

    number_format = workbook.add_format({
        'num_format': '#,##0.00'
    })

    # Write title
    worksheet.merge_range('A1:D1', 'Water Quality Treatment Analysis Report', title_format)
    worksheet.write('A2', f'Generated: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')

    current_row = 4

    # Input data section
    worksheet.write(current_row, 0, 'Input Water Quality Data', section_format)
    current_row += 1
    worksheet.write(current_row, 0, 'Parameter', header_format)
    worksheet.write(current_row, 1, 'Value', header_format)
    worksheet.write(current_row, 2, 'Unit', header_format)
    current_row += 1

    input_params = [
        ('Turbidity', input_data.get('turbidity', 0), 'NTU'),
        ('Iron', input_data.get('iron', 0), 'mg/L'),
        ('Manganese', input_data.get('manganese', 0), 'mg/L'),
        ('Ammonia-N', input_data.get('ammonia', 0), 'mg/L as N'),
        ('pH', input_data.get('ph', 0), 'pH units'),
        ('Color', input_data.get('color', 0), 'TCU')
    ]

    for param, value, unit in input_params:
        worksheet.write(current_row, 0, param)
        worksheet.write_number(current_row, 1, value, number_format)
        worksheet.write(current_row, 2, unit)
        current_row += 1

    current_row += 1  # Blank row

    # Dosage section
    worksheet.write(current_row, 0, 'Recommended Chemical Dosages', section_format)
    current_row += 1
    worksheet.write(current_row, 0, 'Chemical', header_format)
    worksheet.write(current_row, 1, 'Dosage', header_format)
    worksheet.write(current_row, 2, 'Unit', header_format)
    current_row += 1

    dosage_params = [
        ('Alum', dosage_data.get('alum_dose', 0), 'mg/L'),
        ('Soda Ash', dosage_data.get('soda_ash_dose', 0), 'mg/L'),
        ('Chlorine', dosage_data.get('chlorine_dose', 0), 'mg/L'),
        ('Calcium Hypochlorite', dosage_data.get('disc_dose', 0), 'mg/L')
    ]

    for param, value, unit in dosage_params:
        worksheet.write(current_row, 0, param)
        worksheet.write_number(current_row, 1, value, number_format)
        worksheet.write(current_row, 2, unit)
        current_row += 1

    current_row += 1  # Blank row

    # Predicted quality section
    worksheet.write(current_row, 0, 'Predicted Post-Treatment Water Quality', section_format)
    current_row += 1
    worksheet.write(current_row, 0, 'Parameter', header_format)
    worksheet.write(current_row, 1, 'Predicted Value', header_format)
    worksheet.write(current_row, 2, 'Unit', header_format)
    worksheet.write(current_row, 3, 'WHO Limit', header_format)
    current_row += 1

    predicted_params = [
        ('Turbidity', dosage_data.get('predicted_turbidity', 0), 'NTU', '< 1.0'),
        ('Iron', dosage_data.get('predicted_iron', 0), 'mg/L', '< 0.3'),
        ('Manganese', dosage_data.get('predicted_manganese', 0), 'mg/L', '< 0.1'),
        ('Ammonia-N', dosage_data.get('predicted_ammonia', 0), 'mg/L as N', '< 1.5'),
        ('pH', dosage_data.get('predicted_ph', 0), 'pH units', '6.5 - 8.5')
    ]

    for param, value, unit, limit in predicted_params:
        worksheet.write(current_row, 0, param)
        worksheet.write_number(current_row, 1, value, number_format)
        worksheet.write(current_row, 2, unit)
        worksheet.write(current_row, 3, limit)
        current_row += 1

    current_row += 1  # Blank row

    # Compliance section
    worksheet.write(current_row, 0, 'Compliance Assessment', section_format)
    current_row += 1
    worksheet.write(current_row, 0, 'Overall Status:', header_format)
    status_value = compliance_data.get('status', 'UNKNOWN')
    if status_value == 'PASS':
        worksheet.write(current_row, 1, status_value, pass_format)
    else:
        worksheet.write(current_row, 1, status_value, fail_format)
    current_row += 2

    violations = compliance_data.get('violations', [])
    if violations:
        worksheet.write(current_row, 0, 'Violations Detected:', section_format)
        current_row += 1
        worksheet.write(current_row, 0, 'Parameter', header_format)
        worksheet.write(current_row, 1, 'Value', header_format)
        worksheet.write(current_row, 2, 'Limit', header_format)
        worksheet.write(current_row, 3, 'Unit', header_format)
        worksheet.write(current_row, 4, 'Notes', header_format)
        current_row += 1

        for violation in violations:
            worksheet.write(current_row, 0, violation.get('parameter', ''))
            worksheet.write_number(current_row, 1, violation.get('value', 0), number_format)
            worksheet.write_number(current_row, 2, violation.get('limit', 0), number_format)
            worksheet.write(current_row, 3, violation.get('unit', ''))
            worksheet.write(current_row, 4, violation.get('note', ''))
            current_row += 1
    else:
        worksheet.write(current_row, 0, 'All parameters within WHO standards.', section_format)
        current_row += 1

    current_row += 1  # Blank row

    # Confidence section
    worksheet.write(current_row, 0, 'Model Confidence Index', section_format)
    current_row += 1
    worksheet.write(current_row, 0, 'Confidence:', header_format)
    worksheet.write_number(current_row, 1, confidence_index, number_format)
    worksheet.write(current_row, 2, '%')
    current_row += 1

    # Interpretation
    confidence_interpretation = ""
    if confidence_index >= 90:
        confidence_interpretation = "High confidence - results are reliable"
    elif confidence_index >= 70:
        confidence_interpretation = "Moderate confidence - results are reasonably reliable"
    elif confidence_index >= 50:
        confidence_interpretation = "Low confidence - consider additional verification"
    else:
        confidence_interpretation = "Preliminary confidence - results should be validated with additional testing"

    worksheet.write(current_row, 0, 'Interpretation:', header_format)
    worksheet.write(current_row, 1, confidence_interpretation)
    current_row += 2

    # Footer
    worksheet.merge_range(f'A{current_row}:D{current_row}', 'Water Quality Treatment Software - Generated for River Ndarugu Water Treatment Plant')
    worksheet.merge_range(f'A{current_row+1}:D{current_row+1}', 'This report is for informational purposes only. Always consult with water treatment professionals.')

    workbook.close()
    output.seek(0)
    return output.getvalue()

def generate_summary_report(input_data: Dict[str, Any], dosage_data: Dict[str, Any], compliance_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate a summary report in dictionary format.

    Args:
        input_data: Raw water quality input
        dosage_data: Calculated chemical dosages
        compliance_data: Compliance check results

    Returns:
        Dictionary containing summary report
    """
    return {
        "timestamp": datetime.now().isoformat(),
        "input_summary": {
            "turbidity_ntu": input_data.get('turbidity', 0),
            "iron_mg_l": input_data.get('iron', 0),
            "manganese_mg_l": input_data.get('manganese', 0),
            "ammonia_mg_l": input_data.get('ammonia', 0),
            "ph": input_data.get('ph', 0),
            "color_tcu": input_data.get('color', 0)
        },
        "dosage_summary": {
            "alum_mg_l": dosage_data.get('alum_dose', 0),
            "soda_ash_mg_l": dosage_data.get('soda_ash_dose', 0),
            "chlorine_mg_l": dosage_data.get('chlorine_dose', 0),
            "calcium_hypochlorite_mg_l": dosage_data.get('disc_dose', 0)
        },
        "compliance_summary": {
            "status": compliance_data.get('status', 'UNKNOWN'),
            "violation_count": len(compliance_data.get('violations', [])),
            "compliant": compliance_data.get('status', 'UNKNOWN') == 'PASS'
        }
    }

class ReportsGenerator:
    """API class for report generation"""

    @staticmethod
    def generate_pdf_report(input_data, dosage_data, compliance_data, confidence_index):
        return generate_pdf_report(input_data, dosage_data, compliance_data, confidence_index)

    @staticmethod
    def generate_excel_report(input_data, dosage_data, compliance_data, confidence_index):
        return generate_excel_report(input_data, dosage_data, compliance_data, confidence_index)

    @staticmethod
    def generate_summary_report(input_data, dosage_data, compliance_data):
        return generate_summary_report(input_data, dosage_data, compliance_data)