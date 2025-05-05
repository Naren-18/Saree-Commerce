import { Product } from '../types/product';
import { supabase } from '../types/supabase_setup';

// Table name in Supabase
const PRODUCTS_TABLE = 'products';
const STORAGE_BUCKET = 'products';

// Get all products from Supabase
export const getProducts = async (): Promise<Product[]> => {
  try {
    console.log('Fetching products from Supabase...');
    const { data, error } = await supabase
      .from(PRODUCTS_TABLE)
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    console.log('Products fetched successfully:', data);
    return data as Product[] || [];
  } catch (error) {
    console.error('Error fetching products from Supabase:', error);
    throw error;
  }
};

// Upload image to Supabase Storage
export const uploadProductImage = async (file: File): Promise<string> => {
  try {
    // Generate a unique filename
    const timestamp = new Date().getTime();
    const fileExtension = file.name.split('.').pop();
    const fileName = `product_${timestamp}.${fileExtension}`;
    const filePath = `public/${fileName}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      throw error;
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Add a new product to Supabase
export const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  try {
    const { data, error } = await supabase
      .from(PRODUCTS_TABLE)
      .insert([product])
      .select();
    
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      throw new Error('Failed to insert product');
    }
    
    return data[0] as Product;
  } catch (error) {
    console.error('Error adding product to Supabase:', error);
    throw error;
  }
};

// Update an existing product in Supabase
export const updateProduct = async (id: number, updates: Partial<Product>): Promise<Product> => {
  try {
    const { data, error } = await supabase
      .from(PRODUCTS_TABLE)
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      throw new Error(`Product with ID ${id} not found`);
    }
    
    return data[0] as Product;
  } catch (error) {
    console.error('Error updating product in Supabase:', error);
    throw error;
  }
};

// Delete a product from Supabase
export const deleteProduct = async (id: number): Promise<void> => {
  try {
    // First get the product to check if it has an image to delete
    const { data: product, error: getError } = await supabase
      .from(PRODUCTS_TABLE)
      .select('image')
      .eq('id', id)
      .single();
    
    if (getError) {
      throw getError;
    }
    
    // Delete the product
    const { error: deleteError } = await supabase
      .from(PRODUCTS_TABLE)
      .delete()
      .eq('id', id);
    
    if (deleteError) {
      throw deleteError;
    }
    
    // If the product has an image, try to delete it from storage
    if (product && product.image) {
      try {
        // Extract the filename from the URL
        const url = new URL(product.image);
        const pathParts = url.pathname.split('/');
        const fileName = pathParts[pathParts.length - 1];
        
        if (fileName) {
          const { error: storageError } = await supabase.storage
            .from(STORAGE_BUCKET)
            .remove([fileName]);
          
          if (storageError) {
            console.warn('Error deleting image from storage:', storageError);
          }
        }
      } catch (imageError) {
        console.warn('Error parsing image URL:', imageError);
      }
    }
  } catch (error) {
    console.error('Error deleting product from Supabase:', error);
    throw error;
  }
};
