PROMPT: UI Enhancement for Water Quality Treatment Software - Fix Issues & Improve Interaction

OBJECTIVE:
Improve the React frontend to fix input issues and provide better data representation with clear formulas display.

ISSUES TO ADDRESS:
1. **Input 0 Problem** - Number inputs don't accept/display 0 values properly (controlled input issue)
2. **No Formula Visibility** - Users can't see what formulas are used for calculations
3. **Missing Interaction** - No clear explanation of what the software does
4. **Data Representation** - Need better charts, graphs, and visual feedback

ENHANCEMENTS REQUIRED:

1. **Fix Number Inputs**
   - Change `value={formData.x || ''}` to handle 0 properly
   - Use proper controlled input pattern for numeric fields
   - Display placeholder values when inputs are empty

2. **Add Formula Display System**
   - Add collapsible "Formula Details" section showing exactly:
     * Alum = 15 + 0.40×Turbidity (clamped 10-150 mg/L)
     * Soda Ash = 1.01×(20 - Alkalinity Remaining)
     * Chlorine = Oxidation (0.64×Fe + 1.29×Mn) + Demand (7.6×NH3-N + 0.64×Fe + ...) + Residual
     * Who Limits: Turbidity < 1.0 NTU, Iron < 0.3 mg/L, Mn < 0.1 mg/L, pH 6.5-8.5
   - Show real-time updates as user types

3. **Improve Charts Integration**
   - Ensure all charts render with proper data
   - Add chart titles and descriptions
   - Add WHO limit reference lines on radar chart
   - Include dosage range references

4. **Enhanced UI Sections**
   - **Header**: Add brief description of software purpose
   - **Input Form**: Better labels and help text
   - **Results Section**:
     * Chemical dosages table WITH formulas shown inline
     * Predicted water quality table WITH efficiency percentages
     * Charts WITH clear labels and legends
     * Confidence indicator WITH interpretation text
     * Export buttons WITH loading states

5. **Better Visual Feedback**
   - Loading spinners during calculations
   - Success/error toasts
   - Real-time validation feedback
   - Hover tooltips with formula explanations

IMPLEMENTATION APPROACH:
- Keep existing chart component but ensure it renders
- Fix controlled input pattern in App.tsx
- Add FormulaDisplay component below main results
- Add section headers with descriptive text
- Maintain current styling but enhance with formula context

DELIVERABLES:
✅ Fixed number input handling (0 values accepted)
✅ Enhanced results section with formula context
✅ Clear chart visualization with data labels
✅ Loading states and user feedback
✅ Responsive design maintained

TECH STACK CONFIRMATION:
- Frontend: Vite + React + TypeScript + Recharts (already installed)
- Backend: FastAPI (unchanged)
- No new dependencies needed