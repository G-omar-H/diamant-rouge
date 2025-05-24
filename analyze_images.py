#!/usr/bin/env python3
import os
import glob
from PIL import Image
import sys

def analyze_image(image_path):
    try:
        with Image.open(image_path) as img:
            file_size = os.path.getsize(image_path) / (1024 * 1024)  # Size in MB
            file_format = img.format
            width, height = img.size
            mode = img.mode
            
            print(f"File: {os.path.basename(image_path)}")
            print(f"  Format: {file_format}")
            print(f"  Dimensions: {width}x{height}")
            print(f"  Color Mode: {mode}")
            print(f"  Size: {file_size:.2f} MB")
            
            # Basic quality assessment
            if file_size > 3:
                print("  Quality: High resolution but large file size")
            elif width > 1000 and height > 1000:
                print("  Quality: Good resolution")
            else:
                print("  Quality: Lower resolution")
            
            print("---")
    except Exception as e:
        print(f"Error analyzing {os.path.basename(image_path)}: {e}")
        print("---")

def main():
    products_dir = "diamant-rouge/public/images/products"
    
    if not os.path.exists(products_dir):
        print(f"Directory {products_dir} not found")
        return
    
    image_files = glob.glob(f"{products_dir}/*.png") + glob.glob(f"{products_dir}/*.jpg") + glob.glob(f"{products_dir}/*.jpeg")
    
    if not image_files:
        print("No image files found")
        return
    
    print(f"Found {len(image_files)} image files\n")
    
    # Analyze first 10 images as a sample
    sample_size = min(10, len(image_files))
    print(f"Analyzing first {sample_size} images as a sample:\n")
    
    for i, image_path in enumerate(image_files[:sample_size]):
        analyze_image(image_path)

if __name__ == "__main__":
    main() 