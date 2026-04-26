import json

notebook_path = 'd:/nai/nalam-ai/Nalam_AI_Colab_Setup.ipynb'

with open(notebook_path, 'r', encoding='utf-8') as f:
    nb = json.load(f)

markdown_cell = {
    'cell_type': 'markdown',
    'metadata': {},
    'source': [
        '### 🔗 Open Dataset Link & Advanced Analytics\n',
        'Run the cell below to load the simulated Tamil Nadu public health dataset and generate advanced analytics on resource allocation and demographics.'
    ]
}

code_cell = {
    'cell_type': 'code',
    'execution_count': None,
    'metadata': {},
    'outputs': [],
    'source': [
        'import pandas as pd\n',
        'import matplotlib.pyplot as plt\n',
        'import seaborn as sns\n',
        'import numpy as np\n',
        '\n',
        '# Set seaborn style for better aesthetics\n',
        'sns.set_theme(style="whitegrid")\n',
        '\n',
        'print("🔗 NALAM AI - OPEN DATASET LINK")\n',
        'print("======================================")\n',
        'print("📥 Tamil Nadu Public Health Outbreak Dataset (Simulated):")\n',
        'print("🔗 Link: https://raw.githubusercontent.com/gan1014/Nalam_AI_2.0/main/data/tn_disease_outbreak_2024.csv")\n',
        'print("(Note: In this demo, we are using a synthetically generated dataset to ensure patient privacy compliance.)\\n")\n',
        '\n',
        '# --- DATA GENERATION ---\n',
        'districts = ["Chennai", "Coimbatore", "Madurai", "Salem", "Tirunelveli"]\n',
        'diseases = ["Dengue", "Scrub Typhus", "Gastroenteritis", "Heat Stroke"]\n',
        '\n',
        '# Create a heatmap dataset\n',
        'heatmap_data = pd.DataFrame({\n',
        '    "Dengue": [245, 89, 120, 65, 40],\n',
        '    "Scrub Typhus": [12, 45, 23, 80, 15],\n',
        '    "Gastroenteritis": [310, 150, 180, 90, 110],\n',
        '    "Heat Stroke": [45, 20, 60, 110, 85]\n',
        '}, index=districts)\n',
        '\n',
        '# Create resource allocation dataset\n',
        'resource_data = pd.DataFrame({\n',
        '    "Resource": ["Oxygen Cylinders", "IV Fluids (Liters)", "Dengue NS1 Kits", "Hospital Beds"],\n',
        '    "Currently Available": [450, 1200, 300, 850],\n',
        '    "Required (Next 7 Days)": [800, 2500, 1000, 1200]\n',
        '})\n',
        '\n',
        '# --- PLOT 1: Disease Distribution Heatmap ---\n',
        'fig = plt.figure(figsize=(16, 12))\n',
        '\n',
        '# Subplot 1: Heatmap\n',
        'ax1 = plt.subplot(2, 2, 1)\n',
        'sns.heatmap(heatmap_data, annot=True, fmt="d", cmap="YlOrRd", linewidths=.5, ax=ax1)\n',
        'ax1.set_title("🗺️ Regional Disease Outbreak Density", fontsize=14, pad=15, fontweight="bold")\n',
        'ax1.set_ylabel("Districts", fontweight="bold")\n',
        '\n',
        '# --- PLOT 2: Resource Allocation Gap (Bar Chart) ---\n',
        'ax2 = plt.subplot(2, 2, 2)\n',
        'x = np.arange(len(resource_data["Resource"]))\n',
        'width = 0.35\n',
        '\n',
        'ax2.bar(x - width/2, resource_data["Currently Available"], width, label="Available Stock", color="#10b981")\n',
        'ax2.bar(x + width/2, resource_data["Required (Next 7 Days)"], width, label="Predicted Requirement", color="#ef4444")\n',
        '\n',
        'ax2.set_ylabel("Unit Count", fontweight="bold")\n',
        'ax2.set_title("🏥 Medical Resource Prediction vs Availability", fontsize=14, pad=15, fontweight="bold")\n',
        'ax2.set_xticks(x)\n',
        'ax2.set_xticklabels(resource_data["Resource"], rotation=15)\n',
        'ax2.legend()\n',
        '\n',
        '# --- PLOT 3: Affected Patient Demographics (Pie Chart) ---\n',
        'ax3 = plt.subplot(2, 2, 3)\n',
        'age_groups = ["Children (0-12)", "Teens (13-19)", "Adults (20-55)", "Seniors (55+)"]\n',
        'cases_by_age = [25, 15, 45, 15]\n',
        'colors = ["#f472b6", "#38bdf8", "#fbbf24", "#c084fc"]\n',
        'explode = (0.1, 0, 0, 0)  # highlight children\n',
        '\n',
        'ax3.pie(cases_by_age, explode=explode, labels=age_groups, colors=colors, autopct="%1.1f%%",\n',
        '        shadow=True, startangle=140, textprops={"fontweight": "bold"})\n',
        'ax3.set_title("👥 Patient Demographics (Dengue)", fontsize=14, pad=15, fontweight="bold")\n',
        '\n',
        '# --- PLOT 4: 30-Day Recovery vs Admission Trend ---\n',
        'ax4 = plt.subplot(2, 2, 4)\n',
        'days = np.arange(1, 31)\n',
        'admissions = 50 + np.sin(days/3) * 20 + days * 2\n',
        'recoveries = 30 + np.sin((days-3)/3) * 15 + days * 1.8\n',
        '\n',
        'ax4.plot(days, admissions, label="New Admissions", color="#ef4444", linewidth=2.5)\n',
        'ax4.plot(days, recoveries, label="Patient Recoveries", color="#10b981", linewidth=2.5)\n',
        'ax4.fill_between(days, admissions, recoveries, where=(admissions > recoveries), color="#ef4444", alpha=0.1, label="Hospital Capacity Strain")\n',
        '\n',
        'ax4.set_title("⚕️ Hospital Admissions vs Recoveries", fontsize=14, pad=15, fontweight="bold")\n',
        'ax4.set_xlabel("Days", fontweight="bold")\n',
        'ax4.set_ylabel("Number of Patients", fontweight="bold")\n',
        'ax4.legend()\n',
        '\n',
        'plt.tight_layout(pad=3.0)\n',
        'plt.show()\n'
    ]
}

nb['cells'].append(markdown_cell)
nb['cells'].append(code_cell)

with open(notebook_path, 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=2)

print('Successfully appended advanced analytics cells to the notebook.')
