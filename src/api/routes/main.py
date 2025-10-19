# src/api/routes/main.py

"""
Vaarush Inheritance Platform - Main FastAPI Application
Digital inheritance management on Algorand blockchain
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import time
import logging

from api.routes import ai, contract

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Vaarush Inheritance Platform API",
    description="Backend API for digital inheritance management on Algorand blockchain",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Restrict to specific domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    """Add processing time to response headers."""
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    logger.info(f"{request.method} {request.url.path} - {process_time:.3f}s")
    return response

# Global exception handlers
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Handle HTTP exceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code,
            "path": str(request.url)
        }
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors."""
    return JSONResponse(
        status_code=422,
        content={
            "error": "Validation error",
            "details": exc.errors(),
            "path": str(request.url)
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle unexpected errors."""
    logger.error(f"Unexpected error: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": "An unexpected error occurred. Please contact support.",
            "path": str(request.url)
        }
    )

# Include routers
app.include_router(ai.router)
app.include_router(contract.router)

# Root endpoints
@app.get("/")
async def root():
    """
    Root endpoint - API information and welcome message.
    """
    return {
        "message": "Welcome to Vaarush Inheritance Platform API",
        "version": "1.0.0",
        "status": "operational",
        "documentation": {
            "swagger": "/docs",
            "redoc": "/redoc",
            "openapi": "/openapi.json"
        },
        "endpoints": {
            "ai": "/ai/ask",
            "contract": "/contract/deploy",
            "health": "/health"
        }
    }

@app.get("/health")
async def health_check():
    """
    Global health check endpoint.
    Returns status of all services.
    """
    return {
        "status": "healthy",
        "service": "Vaarush API",
        "version": "1.0.0",
        "components": {
            "api": "operational",
            "ai_assistant": "operational",
            "blockchain": "operational"
        }
    }

@app.get("/info")
async def api_info():
    """
    Detailed API information.
    """
    return {
        "name": "Vaarush Inheritance Platform",
        "description": "Digital inheritance management on Algorand blockchain",
        "version": "1.0.0",
        "features": [
            "Smart contract deployment",
            "Heir registration",
            "Asset claim management",
            "AI-powered assistance",
            "Blockchain verification"
        ],
        "blockchain": "Algorand",
        "contact": {
            "developer": "Vaarush Team",
            "support": "support@vaarush.com"
        }
    }

# Run server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "api.routes.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Disable in production
        log_level="info"
    )
