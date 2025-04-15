from flask import Flask, request, jsonify
from flask_cors import CORS
from warehouse import warehouse, Bin
import json

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return jsonify({
        'status': 'running',
        'message': 'Warehouse API is running',
        'available_endpoints': [
            '/api/stock/status',
            '/api/stock/add',
            '/api/stock/dispatch',
            '/api/bins/status'
        ]
    })

@app.route('/api/stock/status', methods=['GET'])
def get_stock_status():
    try:
        return jsonify(warehouse.get_stock_status())
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/stock/add', methods=['POST'])
def add_stock():
    data = request.json
    try:
        # Find or create bin
        bin_id = data.get('bin_id', 'B1')
        bin_capacity = data.get('bin_capacity', 100)
        
        # Check if bin exists
        existing_bin = next((b for b in warehouse.bins if b.id == bin_id), None)
        if not existing_bin:
            new_bin = Bin(bin_id, bin_capacity)
            warehouse.add_bin(new_bin)
            existing_bin = new_bin
        
        # Add item to bin
        existing_bin.add_item(
            data['item_id'],
            data['quantity'],
            data['height']
        )
        
        return jsonify({
            'status': 'success',
            'message': 'Stock added successfully',
            'bin_status': warehouse.get_bin_status()
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400

@app.route('/api/stock/dispatch', methods=['POST'])
def dispatch_stock():
    data = request.json
    try:
        dispatched = warehouse.dispatch_item(
            data['item_id'],
            data['quantity']
        )
        return jsonify({
            'status': 'success',
            'message': f'Dispatched {dispatched} units',
            'stock_status': warehouse.get_stock_status()
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400

@app.route('/api/bins/status', methods=['GET'])
def get_bins_status():
    try:
        return jsonify(warehouse.get_bin_status())
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0') 