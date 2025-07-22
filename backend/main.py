from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from jinja2 import Environment, FileSystemLoader
import json
from models import LayoutConfig

app = FastAPI(title="Dashboard Code Generator")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], #React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Jinja2 environment
jinja_env = Environment(loader=FileSystemLoader('templates'))

def render_chart_component(chart_config: dict) -> str:
    """Render a chart component using its template."""
    template_name = f"components/chart_{chart_config['type']}.tsx.jinja"
    try:
        template = jinja_env.get_template(template_name)
        return template.render(**chart_config)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Chart template error: {str(e)}")

def render_filter_component(filter_config: dict) -> str:
    """Render a filter component using its template."""
    template_name = f"components/filter_{filter_config['type']}.tsx.jinja"
    try:
        template = jinja_env.get_template(template_name)
        return template.render(**filter_config)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Filter template error: {str(e)}")

@app.post("/generate-code")
async def generate_dashboard_code(config: LayoutConfig):
    """Generate TSX code based on layout configuration."""
    
    try:
        # Select layout template
        if config.layout == "minimal-reports":
            layout_template = jinja_env.get_template('layout_minimal_reports.tsx.jinja')
        elif config.layout == "jacket-reports":
            layout_template = jinja_env.get_template('layout_jacket_reports.tsx.jinja')
        else:
            raise HTTPException(status_code=400, detail="Invalid layout type")
        
        # Render chart components
        rendered_charts = []
        chart_sections = config.alleys if config.alleys else config.lanes
        
        if chart_sections:
            for section in chart_sections:
                section_charts = []
                for chart in section.charts:
                    chart_dict = chart.dict()
                    rendered_chart = render_chart_component(chart_dict)
                    section_charts.append(rendered_chart)
                rendered_charts.append(section_charts)
        
        # Render filter components
        rendered_filters = []
        for filter_config in config.filters:
            filter_dict = filter_config.dict()
            rendered_filter = render_filter_component(filter_dict)
            rendered_filters.append(rendered_filter)
        
        # Render layout with all components
        tsx_code = layout_template.render(
            cards=config.cards,
            rendered_filters=rendered_filters,
            rendered_charts=rendered_charts,
            include_table=config.include_table,
            layout_type=config.layout
        )
        
        # Return as downloadable file
        return Response(
            content=tsx_code,
            media_type="text/plain",
            headers={"Content-Disposition": "attachment; filename=Dashboard.tsx"}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Code generation error: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
